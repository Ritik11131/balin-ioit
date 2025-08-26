import { Component, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { GenericFormGeneratorComponent } from '../../shared/components/generic-form-generator/generic-form-generator.component';
import { WHITELABEL_TABLE_TOOLBAR } from '../../shared/constants/table-toolbar';
import { WHITELABEL_TABLE_CONFIG } from '../../shared/constants/table-config';
import { CREATE_WHITELABEL_FORM_FIELDS } from '../../shared/constants/forms';
import { WhitelabelService } from '../service/whitelabel.service';
import { UiService } from '../../layout/service/ui.service';

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

  editData!: any
  selectedRowItems: any[] = [];
  whiteLabels: any[] = [];
  isLoading: boolean = false;

  constructor(private whiteLabelService: WhitelabelService, private uiService: UiService) { }

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
    throw new Error('Method not implemented.');
  }
  async onWhiteLabelFormSubmit(event: any): Promise<any> {
   console.log('WhiteLabel form submitted:', event);
    const {isEditMode, formValue} = event;
    if(isEditMode) {
      const mergedObj = {...this.editData, ...formValue}
      console.log(mergedObj);
      await this.updateWhiteLabel(mergedObj?.id, mergedObj);
    } else {
      console.log('create');
      const mergedObj = {...formValue}
      await this.createWhiteLabel(mergedObj);
    }
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
    throw new Error('Method not implemented.');
  }
  handleToolBarActions(event: any) {
    if (event.key === 'create') {
      this.formFields = CREATE_WHITELABEL_FORM_FIELDS;
      this.uiService.openDrawer(this.createUpdateWhiteLabel, ' ', '', true)
    }
  }
  handleInTableActions($event: { label: string; row: any; }) {
    throw new Error('Method not implemented.');
  }



}
