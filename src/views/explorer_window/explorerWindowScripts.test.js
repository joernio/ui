import * as explorerWindowScripts from './explorerWindowScripts';

describe("function explorerWindowScripts: ", ()=>{
   it("expect resizeHandler return value to be {drawerWidth: 0} when drawerWidth is < 250 and diff < 0", ()=>{
      expect(explorerWindowScripts.resizeHandler("200px", - 1).drawerWidth).toBe(0);
   });

   it("expect resizeHandler return value to be {drawerWidth} when drawerWidth is > 250 and diff < 0", ()=>{
        const drawerWidth = "500px";
        expect(explorerWindowScripts.resizeHandler(drawerWidth, - 1).drawerWidth).toBe(drawerWidth);
    });

    it("expect resizeHandler return value to be {drawerWidth: '250px'} when drawerWidth is < 250 and diff > 0", ()=>{
        const drawerWidth = "100px";
        expect(explorerWindowScripts.resizeHandler(drawerWidth, 1).drawerWidth).toBe("250px");
    });

    it("expect resizeHandler return value to be {drawerWidth} when drawerWidth is > 250 and diff > 0", ()=>{
        const drawerWidth = "500px";
        expect(explorerWindowScripts.resizeHandler(drawerWidth, 1).drawerWidth).toBe(drawerWidth);
    });
});