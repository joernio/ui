# How To Setup Joern's Frontend Client On Your Local Machine

Note: When this project is packaged, It will be available for all the major os that supports joern, but to run the project in development mode, you need to be on Linux (preferably Ubuntu 20) or Mac. You will have installation issues if you try setting this up on windows. If you use Mac the setup method is still the same, but note that setting up this project in development mode hasn't been done on a Mac before so you may or may not face installation issues.

Also, do not attempt to install this project with yarn, you will face many issues if you try. Follow the steps below exactly like they are here.

## Steps:

1. install node
2. install joern
3. clone the repository from github
4. install packages
5. run joern in server mode
6. run start

### Install node

(you can skip this step if you already have node installed)

1. To install Node.js, follow this link(https://nodejs.org/en/download/). It is recommended that you use the latest LTS version available.

2. test that node was successfully installed by running the commands

```commandline
node -v
npm -v
```

### Install joern

(you can skip this step if you already have joern installed)

1. To install joern, follow this link(https://docs.joern.io/installation).

### Clone the repository from github

1. run the command

```commandline
git clone https://github.com/joernio/ui
```

### Install packages

1. cd into the cloned repository and run

```commandline
npm install
```

2. after the installation above, run

```commandline
npm run rebuild
```

Note: rebuilding is a one-time process and is only necessary after every time you install the project's packages by running npm install. without the rebuild, you might get incompatibility issues between packages. You don't need to run it again if you are not reinstalling the project's packages from scratch.

3. after rebuilding, run the command

```commandline
npm run prod-build
```

you run this command to generate build files. After running it once and unless you make changes to the code, you don't need to run it again every time you want to start up the project.

### Run Joern in server mode

1. To run joern in server mode, follow the instructions in the documentation here(https://docs.joern.io/server)

### Run start:

1. To start up the project, run `npm start` in the directory with the project's package.json file

# How To Build The Executable On Your Local Machine

If you followed the steps above, you can continue with the steps below to learn how to build the tool locally, If not you should start with the steps above first.

## Steps:

1. run production build
2. install electron forge
3. import the project into electron forge
4. build executable

### Run Production Build

1. run the command below to generate a build.

```commandline
npm run prod-build
```

### Install Electron Forge

1. After running the step above, run the command below:

```commandline
npm install @electron-forge/cli -D
```

### Import The Project Into Electron Forge

1. to import the project into electron forge, run

```commandline
npx electron-forge import
```

### Build Executable

1. After running the command above, electron forge modifies your project (mostly package.json) to the format it accepts while building an executable. run the command below to build an executable for your local machine (be patient, this can take a while).

```commandline
npx electron-forge make
```

After the step completes, you should find a folder named out in your project root. open "make" folder inside "out" to access your build. (rpm and deb for Linux, zip file for mac). copy the build to a different directory and install.

Note: run "git reset --hard" to get your project back to its initial stage or else you might face issues with further attempts to pull from git or run "npm start".
