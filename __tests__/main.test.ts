import * as core from "@actions/core";

import run from "../src/main";
import AzureSqlAction from "../src/AzureSqlAction";
import FirewallManager from "../src/FirewallManager";
import { AzureSqlActionHelper } from "../src/AzureSqlActionHelper";
import { SqlConnectionStringBuilder } from "../src/SqlConnectionStringBuilder";

jest.mock('@actions/core');
jest.mock('../src/AzureSqlAction');
jest.mock('../src/FirewallManager');
jest.mock('../src/AzureSqlResourceManager');
jest.mock('../src/WebClient/Authorizer/AuthorizerFactory');
jest.mock('../src/SqlConnectionStringBuilder');

describe('main.ts tests', () => {
    it('gets inputs and executes action', async () => {
        let resolveFilePathSpy = jest.spyOn(AzureSqlActionHelper, 'resolveFilePath').mockReturnValue('./TestDacpacPackage.dacpac');

        let getInputSpy = jest.spyOn(core, 'getInput').mockImplementation((name, options) => {
            switch(name) {
            case 'server-name': return 'test.database.windows.net';
            case 'connection-string': return 'Server=tcp:testServer.database.windows.net, 1433;Initial Catalog=testDB;User Id=testUser;Password=testPassword;';
            case 'dacpac-package': return './TestDacpacPackage.dacpac';
        }

        return '';
        }); 

        let addFirewallRuleSpy = jest.spyOn(FirewallManager.prototype, 'addFirewallRule');
        let actionExecuteSpy = jest.spyOn(AzureSqlAction.prototype, 'execute');
        let removeFirewallRuleSpy = jest.spyOn(FirewallManager.prototype, 'removeFirewallRule');

        await run();

        expect(AzureSqlAction).toHaveBeenCalled();
        expect(getInputSpy).toHaveBeenCalledTimes(4);
        expect(SqlConnectionStringBuilder).toHaveBeenCalled();
        expect(resolveFilePathSpy).toHaveBeenCalled();
        expect(addFirewallRuleSpy).toHaveBeenCalled();
        expect(actionExecuteSpy).toHaveBeenCalled();    
        expect(removeFirewallRuleSpy).toHaveBeenCalled();      
    })
})