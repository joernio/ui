# How To Setup CPG UI Client On Your Local Machine

Note: When this project is packaged, It will be available for all the major os that supports joern and joern-like programs like ocular, but to run the project in development mode, you need to be on Linux (preferably Ubuntu 20) or Mac. You will have installation issues if you try setting this up on windows. If you use Mac the setup method is still the same, but note that setting up this project in development mode hasn't been done on a Mac before so you may or may not face installation issues.

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

# How To Release A New Version

1. Switch to release branch
2. Pull from master
3. Update version of package.json
4. Commit changes
5. Tag the latest commit
6. push tag and commit to remote release branch
7. Merge release branch into master

### Switch to release branch

1. To switch to release branch run:

```commandline
git checkout release
```

To verify that you are now on the release branch run:

```commandline
git branch
```

### Pull from master

1. to pull the changes to be released from origin master, run:

```commandline
git pull origin master
```

If no merge conflicts occurred, then you are good to go. If you get a merge conflict, it is likely that conflicting changes were added to the release or master branch, you MUST fix this before continuing.

### Update version of package.json

1. go to the package.json file and bump up the version. Note that the version name MUST not start with a leading "v" or the build will fail. An example version name for the package.json file is "1.0.0-a.5".

### Commit changes

1. To commit the changes made to package.json, run:

```commandline
git add .
git commit -m <commit message here>
```

It is important that the commit message reflects what changes were made. An example commit message is "bumped package.json file version to 1.0.0-a.5"

### Tag The latest commit

1. To tag the latest commit, run:

```commandline
git tag <sermver version>
```

Note: Though an annotated tag will probably work as well, it is recommended that you use lightweight tagging (like was done in the git command above). Also, note that the version name MUST comply with the semantic versioning specification for this to work. An Example version name is "v1.0.0-a.5".

### Push tag and commit to the remote release branch

1. To push tag and commit to the remote release branch, run:

```commandline
git push origin <tag name> && git push origin release
```

Note: tag name should be the tag you created in step "5" to avoid messing up the versioning. Also to avoid unintended issues, ALWAYS push the tag before pushing the commit.

After this wait for the build to complete

### Merge release branch into Master

1. After the build has been completed, go to Github and create a PR comparing release branch and master. Merge this PR.
