export const joernWelcomeScreen = `
\r
\r      ██╗ ██████╗ ███████╗██████╗ ███╗   ██╗
\r      ██║██╔═══██╗██╔════╝██╔══██╗████╗  ██║
\r      ██║██║   ██║█████╗  ██████╔╝██╔██╗ ██║
\r ██   ██║██║   ██║██╔══╝  ██╔══██╗██║╚██╗██║
\r ╚█████╔╝╚██████╔╝███████╗██║  ██║██║ ╚████║
\r  ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
\r
\r Type "help" or "browse(help)" to begin
\r
`;

export const joernDefaultPrompt = '\r\n joern> ';

export const joernManagementCommands = {
  close: 'close',
  delete: 'delete',
  importCode: 'importCode',
  importCpg: 'importCpg',
  open: 'open',
  switchWorkspace: 'switchWorkspace',
};

export const apiErrorStrings = {
  ws_not_connected: 'WS_NOT_CONNECTED',
  no_result_for_uuid: 'No result found for specified UUID',
};

export const printable = {"0": true,
                          "1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,
                          "a":true,"b":true,"c":true,"d":true,"e":true,"f":true,"g":true,"h":true,"i":true,
                          "j":true,"k":true,"l":true,"m":true,"n":true,"o":true,"p":true,"q":true,"r":true,
                          "s":true,"t":true,"u":true,"v":true,"w":true,"x":true,"y":true,"z":true,
                          "`":true,"~":true,"!":true,"@":true,"#":true,"$":true,"%":true,"^":true,"&":true,
                          "*":true,"(":true,")":true,"-":true,"_":true,"=":true,"+":true,"[":true,"{":true,
                          "]":true,"}":true,"\\":true,"|":true,";":true,":":true,",":true,"<":true,".":true,
                          ">":true,"/":true,"?":true,"'":true, "\"":true," ":true,"  ":true
                        }
