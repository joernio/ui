-------
Usage
-------

Below is a labeled diagram of the main sections of CPG UI Client;

.. image:: ./fullpage_labelled.png

1. File Menu
2. Explorer section toggle control
3. Query shortcut view
4. Rules management view
5. Rules results view
6. Open editor section
7. Workspace section
8. Folders section
9. Terminal section toggle control
10. Settings modal toggle control
11. Queries status section
12. Explorer section
13. Server connection status section
14. Query input section
15. Terminal view section
16. Terminal hide control
17. Terminal minimize/maximize control
18. Editor section
---------------------------------------
19. AST graph Viewer
20. Binary viewer




1. File Menu
==================

This section contains the normal actions one would expect to be in the
file menu section of every tool, plus actions that are unique to code analytic
tools like importing code and switching workspace:

.. image:: ./screenshot_file_context.png


2. Explorer section toggle control
======================================================================

This control button can be used to collapse and expand the whole explorer section.

3. Query Shortcut View
======================================================================
The query shortcut view is used for the creation and management of your frequently used queries.
This is especially useful to power-users who don't want to keep typing "cpg.method.name("main").dotAst.l" for example over and over again.

.. image:: ./query_shortcut_view.png

4. Rules Management View
======================================================================
This is a nice UI for the rules we have in the rules-config.json (see settings). Here we can manage and execute rules.

.. image:: ./rules_management.png

5. Rules Results View
======================================================================
This view is used to view the results of rules executed inthe rules management view.

.. image:: ./rules_result.png

6. Open Editor Section
======================================================================
Here you will see all the files that are currently open in the editor. Clicking on a file makes it the active file on the editor

7. Workspace Section
======================================================================
This section contains all the projects open in a particular workspace.
* If the workspace does not contain any project, you will be asked to import a project.
* Clicking on the "more" icon at the top right-hand side of the workspace section
  reveals a hidden menu where you can perform actions like importing a project, deleting a project, and switching to a different workspace

.. image:: ./workspace_context.png

* Right-clicking on individual projects also reveals a context menu where you open, close, and delete a single project

.. image:: ./screenshot_project_right_click.png

8. Folders Section
======================================================================
This section is where the folder structure of the currently active project is displayed.
* You can inspect the folders and files of the currently active project.
* When you click on a file in the folder section, the file will be opened in the editor.
* Clicking on the "more" icon at the top right-hand side of the folder reveals a hidden menu through which you can change the folder in view by selecting any folder of your choice.

.. image:: ./screenshot_switch_folder.png

9. Terminal Section Toggle Control
======================================================================
This control determines if the terminal section should be hidden or visible.

10. Settings Modal Toggle Control
======================================================================
Clicking on this toggles the settings modal. In the settings, you can specify the URL (and WebSocket URL) to the backend you want the client to connect.
You can also change things like server authentication, font size, theme, large folders to be ignored when rendering sections like the folder and scripts section.

.. image:: ./screenshot_settings_page.png

11. Queries Status Section
======================================================================
This indicates whether there is a currently running query or not, and how many queries have been ran since the tool was opened.
Hovering on this section reveals additional details showing all previously ran queries, status (pending or completed), and total time it took to run the query.

.. image:: ./screenshot_status_section.png

12. Explorer Section
======================================================================
This section houses other sections like folder section, workspace section, etc.

13. Server Connection Status Section
======================================================================
This section indicates the UI client's connection status to the server.
* If the server with the server URL in the settings is not active, the connection status will be "failed" and queries won't work.
* You can right-click on this section to manually connect and disconnect from the server

.. image:: ./screenshot_connect_reconnect.png

14. Query Input Section
======================================================================
Just like you can perform certain actions (like opening, closing, and importing projects)
through the GUI alone without typing any queries, you can also choose to manually type your queries instead.
* To type queries manually, this section is where input your manual queries.
* Queries and results will appear on top according to the order you ran them.

15. Terminal View Section
======================================================================
This is the place where you can view queries and their results.

16. Terminal Hide Control
======================================================================
This controls whether the terminal section is visible or not.

17. Terminal Minimize/Maximize Control
======================================================================
As the name suggests, this can be used to minimize or maximize the terminal.

18. Editor Section
======================================================================
This is the section where scripts can be viewed and edited. Other files
that are not scripts can only be viewed here, the editor only allows read-only mode for those files.

19. Ast Graph Viewer
======================================================================
this view opens when you run a query that returns ast graph, for example 'cpg.method.name("main").dotAst.l'.
It is important that this graph has a root node or else it won't draw the graph.

.. image:: ./ast_graph.png

20. Binary Viewer
======================================================================
This view opens when you import a binary e.g. "/bin/curl" into your workspace.
It decompiles the binary and gives you readable code.

.. image:: ./binary_viewer.png



Secure and Non-Secure Connections
======================================================================

The first time you run this UI, you can begin making queries immediately without worrying about secure connections and setting up an HTTPS reverse-proxy for your CPG installation.
For more advanced usage however (especially if your CPG installation is running on a remote server and/or you worry about connection security and HTTPS),
it is advisable to go through the additional trouble of setting up the HTTPS reverse-proxy and getting it to work with the UI.
This is to ensure that all the traffic between the UI client and the CPG server is encrypted and secure.
To toggle between http/https connections, click on the settings icon and enable or disable HTTP connections.

Luckily we wrote a basic script template to help make the HTTPS reverse-proxy server setup and certificate generation on your local machine painless.

To set up your basic HTTPS reverse-proxy server with a self-signed certificate on your local machine, follow the steps below:

* Open the source code folder in the tar.gz/ zip of the release you have installed (You can contact the team to help you if you can't find this).

* Inside the repository folder, copy the file named "httpslocalhost.sh" to any folder of your choice (Desktop for example).

* Run the copied file with the command ``sudo bash ./httpslocalhost.sh``

* Open the UI settings dialog and change the URL field to `https://localhost:443`

* Still on the UI settings dialog, add "/etc/nginx/ssl/localhost.p12" to the "Certificate Path" field.

* On the "Certificate Passphrase" field, add the following passphrase "4346d3D2fgefr43542w4w5trdfd3454fsFR3trYFDBrtERT4653wedfgtrfdgsREWWE345w3" then click on save.

If you get a toast saying "Certificate Import Successful" then congratulations, the connection between your CPG server and the UI is encrypted and secured with HTTPS.

.. note:: that the httpslocalhost.sh script Is for demonstration use only. you probably need to use a custom passphrase for the pkcs12 file
          that will be imported into the UI. To change this passphrase, you need to edit the httpslocalhost.sh script to replace the above passphrase with your custom passphrase.
          If you need to specify the passphrase using env, you can visit this `link <https://www.openssl.org/docs/man1.1.1/man1/openssl.html/>`_ to learn the various options available for specifying passphrase.
          If you choose to change the above passphrase to a custom one, do remember that certain special characters are not handled properly on openssl. You might need to stick with letters and numbers.


Advanced
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you would like to create and manage your own reverse-proxy and ssl certificates, there are a few things to keep in mind:

CA-Signed:
  If your server is using a certificate signed by a trusted certificate authority, you don't need to do anything. Just add the URL and start making queries.

Self-Signed:
  If your certificate is self-signed, make sure that you are using the generic certificate signing method where you generate the root certificate and use it to sign a second certificate (server certificate). \
  Also, don't forget to add your local root CA to trusted roots on your local machine. You can check out how we do this by reading the httpsloalhost.sh file.
  To get the certificate to upload to the UI, you need to convert your server certificate to pkcs12 format. Also, avoid using special characters for the pkcs12 file passphrase or you might not be able to decrypt the file after creation.


Also, the nginx reverse-proxy can serve the query database website over https too. To enable this however, you need to edit the /etc/hosts file.
If you wish to serve the query database website over https too, follow the steps below:

* Open the /etc/hosts file with your favorite editor

* Change the line `127.0.0.1 localhost` to `127.0.0.1 localhost querydb.localhost`

* Save the file, close your editor and open the url https://querydb.localhost:443 on your browser.

* To stop the browser from complaining about your self-signed certificate, import the root certificate into your browser's trusted root store.


.. note:: that the httpslocalhost.sh script was created with the assumption that your CPG server is running on port 8080 and that your query database website is running on port 8081. If any of this is not true, \
          edit the nginx server block section in the httpslocalhost.sh script and the change the ports nginx is routing to, to match the ports your CPG and query database website servers are running on.

