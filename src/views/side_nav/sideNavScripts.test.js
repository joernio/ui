import * as sideNavScripts from './sideNavScripts';


describe("function toggleSettingsDialog: ", ()=>{
   it("expect function to return {isSettingsDialogOpen: true} when arg is falsy: ", ()=>{
       [undefined, null, "", false, 0].map(arg=>{
        expect(sideNavScripts.toggleSettingsDialog(arg).isSettingsDialogOpen).toBe(true);
       })
       
   });

   it("expect function to return {isSettingsDialogOpen: false} when arg is truthy: ", ()=>{
    [1, true, "true"].map(arg=>{
     expect(sideNavScripts.toggleSettingsDialog(arg).isSettingsDialogOpen).toBe(false);
    })
    
});
});

describe("function handleDrawerToggle: ", ()=>{
    it("expect function to return {drawerWidth: '250px'} when props.drawerWidth is falsy: ", ()=>{
        [undefined, null, "", false, 0].map(arg=>{
         expect(sideNavScripts.handleDrawerToggle({drawerWidth: arg}).drawerWidth).toBe("250px");
        });
    });

    it("expect function to return {drawerWidth: 0} when props.drawerWidth is truthy: ", ()=>{
        [1, true, "true"].map(arg=>{
         expect(sideNavScripts.handleDrawerToggle({drawerWidth: arg}).drawerWidth).toBe(0);
        });
    });
});


describe("function handleTerminalToggle: ", ()=>{

    it("expect function to return {terminalHeight: '468px'} when props.terminalHeight is falsy: ", ()=>{
        [undefined, null, "", false, 0].map(arg=>{
         expect(sideNavScripts.handleTerminalToggle({terminalHeight: arg}).terminalHeight).toBe('468px');
        });
    });

    it("expect function to return {terminalHeight: '0} when props.terminalHeight is truthy: ", ()=>{
        [1, true, "true"].map(arg=>{
         expect(sideNavScripts.handleTerminalToggle({terminalHeight: arg}).terminalHeight).toBe(0);
        });
    });
});


describe("function handleOnChange: ", ()=>{
  
  it("expect function to assign e.target.checked to value[e.target.id] when e.target.id is 'prefers_dark_mode' : ", ()=>{
    const e = {target: {id: 'prefers_dark_mode', checked: true}};
    expect(sideNavScripts.handleOnChange(e, {}).values[e.target.id]).toBe(e.target.checked);
  });

  it("expect function to assign e.target.checked to value[e.target.id] when e.target.id is 'prefers_terminal_view' : ", ()=>{
    const e = {target: {id: 'prefers_terminal_view', checked: false}};
    expect(sideNavScripts.handleOnChange(e, {}).values[e.target.id]).toBe(e.target.checked);
  });

  it("expect function to assign e.target.value to value[e.target.id] when e.target.id is anything else : ", ()=>{
    const e = {target: {id: 'web_socket_url', value: "http://test.com"}};
    expect(sideNavScripts.handleOnChange(e, {}).values[e.target.id]).toBe(e.target.value);
  });

});


describe("function getSettingsInitialValues: ", ()=>{

    it("expect all properties of getSettingsInitialValues return value to be undefined: ", ()=>{
       const response = sideNavScripts.getSettingsInitialValues();
       Object.keys(response).map(prop=>{
           if(prop === "font_size"){
            expect(response[prop]).toBe(NaN);
           }else{
            expect(response[prop]).toBe(undefined);
           };
       })
    });

    it("expect return value to be properly transformed: ", ()=>{

        const settings = {
            server : {
                url: "http://localhost:8080",
                auth_username: "test_username",
                auth_password: "test password",
            },
            websocket: {
                url: "ws://localhost:8080/connect"
            },
            prefersDarkMode: true,
            prefersTerminalView: true,
            fontSize: "16px"
        }
        const response  =  sideNavScripts.getSettingsInitialValues(settings);

        expect(response.server_url).toBe(settings.server.url);
        expect(response.server_username).toBe(settings.server.auth_username);
        expect(response.server_password).toBe(settings.server.auth_password);
        expect(response.ws_url).toBe(settings.websocket.url);
        expect(response.prefers_dark_mode).toBe(settings.prefersDarkMode);
        expect(response.prefers_terminal_view).toBe(settings.prefersTerminalView);
        expect(response.font_size).toBe(Number(settings.fontSize.split("px")[0]));  
    });

});



describe("function collectSettingsValues: ", ()=>{

    it("expect return value to be properly transformed: ", ()=>{

        const values = {
         server_url: "http://localhost:8080",
         server_username: "test_username",
         server_password: "test password",
         ws_url: "ws://localhost:8080/connect",
         prefers_dark_mode: true,
         prefers_terminal_view: true,
         font_size: 16
        };

        const response  =  sideNavScripts.collectSettingsValues(values);

        expect(response.server.url).toBe(values.server_url);
        expect(response.server.auth_username).toBe(values.server_username);
        expect(response.server.auth_password).toBe(values.server_password);
        expect(response.websocket.url).toBe(values.ws_url);
        expect(response.prefersDarkMode).toBe(values.prefers_dark_mode);
        expect(response.prefersTerminalView).toBe(values.prefers_terminal_view);
        expect(response.fontSize).toBe(`${values.font_size}px`);  
    });

});