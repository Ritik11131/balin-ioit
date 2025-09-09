import { Component, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { GenericFormGeneratorComponent } from '../../shared/components/generic-form-generator/generic-form-generator.component';
import { WHITELABEL_TABLE_TOOLBAR } from '../../shared/constants/table-toolbar';
import { WHITELABEL_TABLE_CONFIG } from '../../shared/constants/table-config';
import { CREATE_WHITELABEL_FORM_FIELDS, UPDATE_WHITELABEL_FORM_FIELDS } from '../../shared/constants/forms';
import { WhitelabelService } from '../service/whitelabel.service';
import { UiService } from '../../layout/service/ui.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-whitelabel',
  imports: [GenericTableComponent, GenericFormGeneratorComponent],
  templateUrl: './whitelabel.component.html',
  styleUrl: './whitelabel.component.scss'
})
export class WhitelabelComponent {
  @ViewChild('createUpdateWhiteLabel') createUpdateWhiteLabel: any;
  

  formFields = CREATE_WHITELABEL_FORM_FIELDS;
  toolbarItems = WHITELABEL_TABLE_TOOLBAR;
  tableConfig = WHITELABEL_TABLE_CONFIG;

  editData!: any;
  selectedRowItems: any[] = [];
  whiteLabels: any[] = [];
  isLoading: boolean = false;

  private actionHandlers: Record<string, (row: any) => void> = {
    'Update': (row) => this.editHandler(row),
    'Delete': (row) => this.deleteHandler(row),
  };

  constructor(private whiteLabelService: WhitelabelService, private uiService: UiService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.init();
  }

  async init(): Promise<void> {
  this.isLoading = true;
  this.whiteLabels = [];

  try {
    const response = await this.whiteLabelService.fetchAllWhiteLabels();

    if (response?.data && Array.isArray(response.data)) {
      this.whiteLabels = response.data;
    } else {
      console.warn('No white labels found or invalid response format:', response);
      this.whiteLabels = [];
    }
  } catch (error) {
    console.error('Error fetching white labels:', error);
    this.whiteLabels = []; // fallback to empty
    // optionally show a snackbar/toast
    // this.snackbar.open('Failed to load white labels. Please try again.', 'Close', { duration: 3000 });
  } finally {
    this.isLoading = false;
  }
}




  onFormValueChange($event: any) {
   console.log($event);
  }

  async onWhiteLabelFormSubmit(event: any): Promise<any> {
   console.log('WhiteLabel form submitted:', event);
    const {isEditMode, formValue} = event;
    if(isEditMode) {
      console.log(this.editData,formValue);
      const updateWhiteLabelObj = {
        id: this.editData?.id,
        lastUpdateOn: this.editData?.lastUpdateOn,
        creationTime: this.editData?.creationTime,
        name: formValue?.name, 
        url: formValue?.url, 
        attributes: JSON.stringify({
          title: formValue?.title,
          logo: formValue?.logo, 
          favicon: formValue?.favicon, 
          message: formValue?.message,
          baseUrl: formValue?.baseUrl,
          themeColor: formValue?.themeColor,
        })}
      await this.updateWhiteLabel(updateWhiteLabelObj?.id, updateWhiteLabelObj);
    } else {
      console.log('create');
      const createWhiteLabelObj = {
        name: formValue?.name, 
        url: formValue?.url, 
        attributes: JSON.stringify({
          title: formValue?.title,
          logo: formValue?.logo, 
          favicon: formValue?.favicon, 
          message: formValue?.message,
          baseUrl: formValue?.baseUrl,
          themeColor: formValue?.themeColor,
        })}
      const mergedObj = {...createWhiteLabelObj}
      await this.createWhiteLabel(mergedObj);
    }
  }

  private async deleteWhiteLabel(data: any): Promise<void> {
    const res = await this.whiteLabelService.deleteWhiteLabel(data);
    this.uiService.showToast('success','Success', res?.data);
    await this.init();
  }

private async updateWhiteLabel(id: any, data: any): Promise<void> {
  try {
    this.uiService.toggleLoader(true);
    const res = await this.whiteLabelService.updateWhiteLabel(id, data);
    this.uiService.closeDrawer();
    this.uiService.showToast('success', 'Success', 'WhiteLabel updated successfully');
    await this.init();
  } catch (error: any) {
    console.error('Error creating WhiteLabel:', error);

    // ✅ Extract error message safely
    const errorMessage =
      error?.error?.message || // API structured error
      error?.message ||        // JS error
      'An unexpected error occurred while creating the WhiteLabel. Please try again.';

    this.uiService.showToast('error', 'Creation Failed', errorMessage);

  } finally {
    this.uiService.toggleLoader(false);
  }
}


private async createWhiteLabel(data: any): Promise<void> {
  try {
    this.uiService.toggleLoader(true);

    const res = await this.whiteLabelService.createWhiteLabel(data);

    // ✅ Close drawer only if success
    this.uiService.closeDrawer();
    this.uiService.showToast('success', 'Success', 'WhiteLabel created successfully');
    await this.init();

  } catch (error: any) {
    console.error('Error creating WhiteLabel:', error);

    // ✅ Extract error message safely
    const errorMessage =
      error?.error?.message || // API structured error
      error?.message ||        // JS error
      'An unexpected error occurred while creating the WhiteLabel. Please try again.';

    this.uiService.showToast('error', 'Creation Failed', errorMessage);

  } finally {
    this.uiService.toggleLoader(false);
  }
}

  onFormCancel() {
     this.formFields = CREATE_WHITELABEL_FORM_FIELDS;
        this.uiService.closeDrawer();
  }


  handleToolBarActions(event: any) {
    if (event.key === 'create') {
      this.formFields = CREATE_WHITELABEL_FORM_FIELDS;
      this.uiService.openDrawer(this.createUpdateWhiteLabel, ' ', '!w-[45vw] md:!w-[45vw] lg:!w-[45vw]', true)
    }
  }

  private async loadWhiteLabelObject(userId: number) {
    try {
      const res = await this.whiteLabelService.getWhiteLabelDetailsById(userId);
      const data = res?.data ?? {};
      const attributes = (() => {
        try {
          return typeof data.attributes === 'string' ? JSON.parse(data.attributes) : data.attributes ?? {};
        } catch {
          return {};
        }
      })();

      const { title = '', logo = '', favicon = '', message = '', baseUrl = '', themeColor = '' } = attributes;

      this.editData = {
        id: data?.id,
        lastUpdateOn: data?.lastUpdateOn,
        creationTime: data?.creationTime,
        name: data.name ?? '',
        url: data.url ?? '',
        logo, favicon, message, baseUrl, title, themeColor
      };

      console.log(logo,favicon);
      
    } catch (error) {
      console.error('Failed to load white label:', error);
      this.editData = null;
    }
  }




  handleInTableActions(event: any) {
    const { label, row } = event;
    this.actionHandlers[label]?.(row);
  }

    async editHandler(row: any): Promise<void> {
      this.formFields = UPDATE_WHITELABEL_FORM_FIELDS;
      this.uiService.openDrawer(this.createUpdateWhiteLabel,' ','!w-[45vw] md:!w-[45vw] lg:!w-[45vw]',true)
      await Promise.all([
        this.loadWhiteLabelObject(row?.id)
      ])
    }

  async deleteHandler(row: any): Promise<void> {
     this.confirmationService.confirm({
            target: row,
            message: `Are you sure that you want to delete ${row?.name}?`,
            header: 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Save',
                severity:'danger'
            },
            accept: async () => {
              await this.deleteWhiteLabel(row);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            },
            reject: () => {
                // this.messageService.add({
                //     severity: 'error',
                //     summary: 'Rejected',
                //     detail: 'You have rejected',
                //     life: 3000,
                // });
            },
        });
  }



}
