sudo apt update
sudo apt install nginx -y
sudo ufw allow 'Nginx HTTPS'

# init folders
rm -rf /etc/nginx/ssl
mkdir /etc/nginx/ssl
sudo mkdir /usr/local/share/ca-certificates/extra

# Remove JoernCA.crt from trusted root certificates if it already exists
rm -rf /usr/local/share/ca-certificates/extra/JoernCA.crt
update-ca-certificates --fresh

# Generate new Certificate Authority certificate and add it to trusted root certificates
openssl genrsa -out /etc/nginx/ssl/JoernCA.key 2048
openssl req -x509 -sha256 -new -nodes -days 3650 \
-key /etc/nginx/ssl/JoernCA.key \
-subj "/C=US/ST=./L=./O=Joern/CN=Joern-CA-Test3" \
-out /etc/nginx/ssl/JoernCA.crt
sudo cp /etc/nginx/ssl/JoernCA.crt /usr/local/share/ca-certificates/extra/JoernCA.crt
sudo update-ca-certificates


# Create extfile to be used in creating signed server certificate
echo "authorityKeyIdentifier = keyid,issuer
basicConstraints = CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
" > /etc/nginx/ssl/localhost.ext

# Create Key file for signed server certificate
openssl genrsa -out /etc/nginx/ssl/localhost.key 2048

# Create file containing additional configurations for creating signed server certificate
echo "
[ req ]
default_bits = 2048
default_md = sha256
prompt = no
encrypt_key = no
distinguished_name = dn
req_extensions = req_ext

[ dn ]
C = US
O = Joern
OU = Joern-Server
CN = localhost

[ req_ext ]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
" > /etc/nginx/ssl/localhost.cnf

# Create certificate signing request file, to be used in creating signed server certificate
openssl req -new -config /etc/nginx/ssl/localhost.cnf \
-key /etc/nginx/ssl/localhost.key -out /etc/nginx/ssl/localhost.csr

# Create signed server certificate file
openssl x509 -req -in /etc/nginx/ssl/localhost.csr \
-CA /etc/nginx/ssl/JoernCA.crt -CAkey /etc/nginx/ssl/JoernCA.key \
-CAcreateserial -days 3650 -sha256 -extfile /etc/nginx/ssl/localhost.ext \
-out /etc/nginx/ssl/localhost.crt

# Create password for signed server certificate in pkcs12 format. This is just for test purposes. You should generate your own password and edit this script to insert it.
echo "4346d3D2fgefr43542w4w5trdfd3454fsFR3trYFDBrtERT4653wedfgtrfdgsREWWE345w3" > /etc/nginx/ssl/p12_passwd #special characters might not work

# Create pkcs12 certificate file
openssl pkcs12 \
-export \
-chain \
-passout file:/etc/nginx/ssl/p12_passwd \
-out /etc/nginx/ssl/localhost.p12 \
-inkey /etc/nginx/ssl/localhost.key \
-in /etc/nginx/ssl/localhost.crt

# Delete password file
rm /etc/nginx/ssl/p12_passwd

# Create Nginx reverse-proxy server block
echo "
server {
    listen 443 ssl http2;
    server_name localhost;
    ssl_certificate /etc/nginx/ssl/localhost.crt;
    ssl_certificate_key /etc/nginx/ssl/localhost.key;
    location / {
    proxy_pass http://localhost:8080/;
    }
}
" > /etc/nginx/sites-available/https-localhost

echo "
server {
    listen 443 ssl http2;
    server_name querydb.localhost;
    ssl_certificate /etc/nginx/ssl/localhost.crt;
    ssl_certificate_key /etc/nginx/ssl/localhost.key;
    location / {
    proxy_pass http://localhost:8081/;
    }
}
" >> /etc/nginx/sites-available/https-localhost

# enable server block
sudo ln -s /etc/nginx/sites-available/https-localhost /etc/nginx/sites-enabled/

# Restart nginx
sudo systemctl restart nginx

# Change permission of sensitive files
chmod -R 755 /etc/nginx/ssl
chmod -R 700 /etc/nginx/ssl/localhost.key
chmod -R 700 /etc/nginx/ssl/JoernCA.key
