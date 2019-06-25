import { window, workspace, WorkspaceFolder } from "vscode";

import IEnvironment from "./IEnvironment";

export default class VSCEnvironment implements IEnvironment {
  private workspaceConfiguration = workspace.getConfiguration("azurite");

  public blobHost(): string | undefined {
    return this.workspaceConfiguration.get<string>("blobHost");
  }

  public blobPort(): number | undefined {
    return this.workspaceConfiguration.get<number>("blobPort");
  }

  public async location(): Promise<string> {
    let location = this.workspaceConfiguration.get<string>("location");

    // When location configuration is not provided, use current opened folder
    if (location === undefined || location === "") {
      if (
        workspace.workspaceFolders === undefined ||
        workspace.workspaceFolders.length === 0
      ) {
        // location = join(homedir(), "Azurite");
        throw Error(
          // tslint:disable-next-line:max-line-length
          `Invalid workspace location for Azurite. Please open a folder in Visual Studio Code, or provide a valid workspace folder path for Azurite in Visual Studio Code setting "azurite.location"`
        );
      }

      let folder: WorkspaceFolder | undefined;
      if (workspace.workspaceFolders.length > 1) {
        folder = await window.showWorkspaceFolderPick({
          placeHolder:
            "Select the working directory you wish to use as Azurite workspace location"
        });
        if (folder === undefined) {
          throw Error(
            // tslint:disable-next-line:max-line-length
            `Invalid workspace location for Azurite. Please select a folder in Visual Studio Code, or provide a valid workspace folder path for Azurite in Visual Studio Code setting "azurite.location"`
          );
        }
      } else {
        folder = workspace.workspaceFolders[0];
      }
      location = folder.uri.fsPath;
    }

    return location;
  }

  public silent(): boolean {
    return this.workspaceConfiguration.get<boolean>("silent") || false;
  }

  public debug(): boolean {
    return this.workspaceConfiguration.get<boolean>("debug") || false;
  }
}
