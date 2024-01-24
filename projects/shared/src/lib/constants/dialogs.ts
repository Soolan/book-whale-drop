import {Dialog} from '@shared-models/dialog';

export const DIALOGS: Dialog[] = [
  {
    heading: 'Delete Document',
    content: 'The document will be deleted. Would you like to proceed?',
    buttons: [
      {
        action: 'Ok',
        icon: 'check'  // this is the value which will be used in mat-icon
      },
      {
        action: 'Cancel',
        icon: 'cancel'
      },
    ]
  },
  // add more dialogs in the future
];
