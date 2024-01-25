import {Dialog} from '@shared-models/dialog';

export const DIALOGS: Dialog[] = [
  {
    title: 'Delete Document',
    content: 'The document will be deleted. Would you like to proceed?',
    actions: [
      {
        action: 'Ok',
        icon: 'check'  // this is the value which will be used in mat-icon
      },
      {
        action: 'Cancel',
        icon: 'close'
      },
    ]
  },
  // As we add more members to the enum we add more dialog data here.
  // Each enum will have the same index as the elements in this array.
];
