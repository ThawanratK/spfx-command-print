import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import { makePDF } from './onePDF';
import { BaseDialog } from '@microsoft/sp-dialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IOnePrintCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'OnePrintCommandSet';

export class PdfDialog extends BaseDialog {
  constructor(private pdfUrl: string) { super(); }

  public render(): void {
    this.domElement.innerHTML = `
      <style>
        .pdf-host {
          width: 90vw; height: 80vh;
          display: flex; flex-direction: column;
        }
        .pdf-iframe { flex: 1; border: 0; }
      </style>
      <div class="pdf-host">
        <iframe class="pdf-iframe" src="${this.pdfUrl}"></iframe>
      </div>
    `;
  }
}

export default class OnePrintCommandSet extends BaseListViewCommandSet<IOnePrintCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized OnePrintCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  //private file_pdf: string = '';
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        makePDF()
        .then((pdfUrl: string) => {
          const dlg = new PdfDialog(pdfUrl);
          void dlg.show(); // แสดง dialog บนหน้าเดิม
        })
        .catch((e) => console.error(e));

        /*makePDF().then((pdf: string) => {
          this.file_pdf = pdf;
          console.log(this.file_pdf);
          Dialog.alert(`Generating PDF...`).catch(() => {
            
          });
        }).catch((error) => {
          console.error('Error generating PDF:', error);
        });*/

        /*Dialog.alert(`${this.properties.sampleTextOne}`).catch(() => {
          
        });*/
        break;
      case 'COMMAND_2':
        Dialog.alert(`${this.properties.sampleTextTwo}`).catch(() => {
          /* handle error */
        });
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}


