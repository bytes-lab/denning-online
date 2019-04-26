denningOnline
  .config(function ($stateProvider, $urlRouterProvider){
    angular.lowercase = angular.$$lowercase;  
    
    $urlRouterProvider.otherwise("/home");

    $stateProvider
      //------------------------------
      // LOGIN
      //------------------------------

      .state ('login', {
        data: {
          access: '?'
        },
        url: '/login',
        controller: 'loginCtrl as lctrl',
        templateUrl: 'views/login.html',
        resolve: {
          dialogTitle: function () {
            return false;
          },
          method: function () {
            return null;
          },
          "$uibModalInstance": function () {
            return null;
          }
        }
      })

      //------------------------------
      // HOME
      //------------------------------

      .state ('home', {
        data: {
          access: '@'
        },
        url: '/home',
        templateUrl: 'views/home.html'
      })

      //------------------------------
      // SEARCH
      //------------------------------

      .state ('search', {
        data: {
          access: '@'
        },
        url: '/search',
        templateUrl: 'views/search.html'
      })

      //------------------------------
      // OVERVIEW
      //------------------------------

      .state ('overview', {
        data: {
          access: '@'
        },
        url: '/overview',
        controller: 'overviewCtrl as vm',
        templateUrl: 'views/overview.html'
      })

      .state ('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html'
      })

      .state ('profile.about', {
        url: '/about',
        templateUrl: 'views/profile-about.html'
      })

      //------------------------------
      // FILE MATTER
      //------------------------------

      .state ('file-matters', {
        data: {
          access: '@'
        },
        url: '/matters',
        templateUrl: 'views/common.html'
      })

      .state ('file-matters.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'matterListCtrl as vm',
        templateUrl: 'views/matter-list.html'
      })

      .state ('file-matters.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:fileNo/:tab',
        controller: 'matterEditCtrl as vm',
        templateUrl: 'views/matter-edit.html'
      })

      .state ('file-matters.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/new',
        controller: 'matterEditCtrl as vm',
        templateUrl: 'views/matter-edit.html'
      })

      //------------------------------
      // MATTER FORM
      //------------------------------
      .state ('matter-forms', {
        data: {
          access: '@'
        },
        url: '/matter-forms',
        templateUrl: 'views/common.html'
      })

      .state ('matter-forms.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'matterformListCtrl as vm',
        templateUrl: 'views/matter-form-list.html'
      })

      .state ('matter-forms.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:code',
        controller: 'matterformEditCtrl as vm',
        templateUrl: 'views/matter-form-edit.html'
      })

      .state ('matter-forms.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/new',
        controller: 'matterformEditCtrl as vm',
        templateUrl: 'views/matter-form-edit.html'
      })

      //------------------------------
      // MATTER CODE
      //------------------------------

      .state ('matter-codes', {
        data: {
          access: '@'
        },
        url: '/matter-codes',
        templateUrl: 'views/common.html'
      })

      .state ('matter-codes.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'matterCodeListCtrl as vm',
        templateUrl: 'views/matter-code-list.html'
      })

      .state ('matter-codes.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'matterCodeEditCtrl as vm',
        templateUrl: 'views/matter-code-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('matter-codes.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'matterCodeEditCtrl as vm',
        templateUrl: 'views/matter-code-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })

      //------------------------------
      // FOLDERS
      //------------------------------

      .state ('folders', {
        data: {
          access: '@'
        },
        url: '/folders',
        templateUrl: 'views/common.html'
      })
      .state ('folders.list', {
        data: {
          access: '@'
        },
        url: '/:id/:type',
        controller: 'folderListCtrl as vm',
        templateUrl: 'views/folder-list.html'
      })

      //------------------------------
      // CONTACTS
      //------------------------------

      .state ('contacts', {
        data: {
          access: '@'
        },
        url: '/contacts',
        templateUrl: 'views/common.html'
      })
      .state ('contacts.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'contactListCtrl as vm',
        templateUrl: 'views/contact-list.html'
      })
      .state ('contacts.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'contactEditCtrl as vm',
        templateUrl: 'views/contact-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('contacts.new', {
        data: {
          access: '@'
        },
        url: '/new/',
        controller: 'contactEditCtrl as vm',
        templateUrl: 'views/contact-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })
      .state ('contacts.matters', {
        data: {
          access: '@',
          type: 'customer'
        },
        url: '/:id/matters',
        controller: 'relatedMatterCtrl as vm',
        templateUrl: 'views/matter-list.html',
      })

      //------------------------------
      // BILLING
      //------------------------------

      .state ('billing', {
        data: {
          access: '@'
        },
        url: '/billing',
        templateUrl: 'views/billing.html'
      })

      //------------------------------
      // QUOTATIONS
      //------------------------------

      .state ('billing.quotations-list', {
        data: {
          access: '@'
        },
        url: '/quotations',
        controller: 'quotationListCtrl as vm',
        templateUrl: 'views/quotation-list.html'
      })

      .state ('billing.quotations-edit', {
        data: {
          access: '@'
        },
        url: '/quotation/edit/:id',
        controller: 'quotationEditCtrl as vm',
        templateUrl: 'views/quotation-edit.html'
      })
      .state ('billing.quotations-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/quotation/new/:fileNo/:billNo',
        controller: 'quotationEditCtrl as vm',
        templateUrl: 'views/quotation-edit.html'
      })

      //------------------------------
      // INVOICES
      //------------------------------

      .state ('billing.invoices-list', {
        data: {
          access: '@'
        },
        url: '/invoices',
        controller: 'invoiceListCtrl as vm',
        templateUrl: 'views/invoice-list.html'
      })

      .state ('billing.invoices-edit', {
        data: {
          access: '@'
        },
        url: '/invoice/edit/:id',
        controller: 'invoiceEditCtrl as vm',
        templateUrl: 'views/invoice-edit.html'
      })
      .state ('billing.invoices-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/invoice/new/:fileNo/:billNo',
        controller: 'invoiceEditCtrl as vm',
        templateUrl: 'views/invoice-edit.html'
      })

      //------------------------------
      // RECEIPTS
      //------------------------------

      .state ('billing.receipts-list', {
        data: {
          access: '@'
        },
        url: '/receipts',
        controller: 'receiptListCtrl as vm',
        templateUrl: 'views/receipt-list.html'
      })

      .state ('billing.receipts-edit', {
        data: {
          access: '@'
        },
        url: '/receipt/edit/:id',
        controller: 'receiptEditCtrl as vm',
        templateUrl: 'views/receipt-edit.html'
      })
      .state ('billing.receipts-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/receipt/new',
        controller: 'receiptEditCtrl as vm',
        templateUrl: 'views/receipt-edit.html'
      })

      //------------------------------
      // PAYMENT REQUESTS
      //------------------------------

      .state ('billing.payment-requests-list', {
        data: {
          access: '@'
        },
        url: '/payment-requests',
        controller: 'paymentRequestListCtrl as vm',
        templateUrl: 'views/payment-request-list.html'
      })

      .state ('billing.payment-requests-edit', {
        data: {
          access: '@'
        },
        url: '/payment-request/edit/:id',
        controller: 'paymentRequestEditCtrl as vm',
        templateUrl: 'views/payment-request-edit.html'
      })
      .state ('billing.payment-requests-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/payment-request/new',
        controller: 'paymentRequestEditCtrl as vm',
        templateUrl: 'views/payment-request-edit.html'
      })

      //------------------------------
      // VOUCHERS
      //------------------------------

      .state ('billing.vouchers-list', {
        data: {
          access: '@'
        },
        url: '/vouchers',
        controller: 'voucherListCtrl as vm',
        templateUrl: 'views/voucher-list.html'
      })

      .state ('billing.vouchers-edit', {
        data: {
          access: '@'
        },
        url: '/voucher/edit/:id',
        controller: 'voucherEditCtrl as vm',
        templateUrl: 'views/voucher-edit.html'
      })
      .state ('billing.vouchers-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/voucher/new',
        controller: 'voucherEditCtrl as vm',
        templateUrl: 'views/voucher-edit.html'
      })

      //------------------------------
      // TRIAL BALANCE
      //------------------------------

      .state ('billing.trial-balances-list', {
        data: {
          access: '@'
        },
        url: '/trial-balances',
        controller: 'trialBalanceListCtrl as vm',
        templateUrl: 'views/trial-balance-list.html'
      })

      .state ('billing.trial-balances-edit', {
        data: {
          access: '@'
        },
        url: '/trial-balances/edit/:id',
        controller: 'trialBalanceEditCtrl as vm',
        templateUrl: 'views/trial-balance-edit.html'
      })
      .state ('billing.trial-balances-new', {
        data: {
          access: '@'
        },
        url: '/trial-balances/new',
        controller: 'trialBalanceEditCtrl as vm',
        templateUrl: 'views/trial-balance-edit.html'
      })

      //------------------------------
      // GENERAL-JOURNALS
      //------------------------------

      .state ('billing.GJ-edit', {
        data: {
          access: '@'
        },
        url: '/general-journal/edit/:id',
        controller: 'generalJournalEditCtrl as vm',
        templateUrl: 'views/general-journal-edit.html'
      })
      .state ('billing.GJ-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/general-journal/new',
        controller: 'generalJournalEditCtrl as vm',
        templateUrl: 'views/general-journal-edit.html'
      })


      //------------------------------
      // CREDIT-NOTES
      //------------------------------

      .state ('billing.CN-edit', {
        data: {
          access: '@'
        },
        url: '/credit-note/edit/:id',
        controller: 'creditNoteEditCtrl as vm',
        templateUrl: 'views/credit-note-edit.html'
      })
      .state ('billing.CN-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/credit-note/new',
        controller: 'creditNoteEditCtrl as vm',
        templateUrl: 'views/credit-note-edit.html'
      })


      //------------------------------
      // DEBIT-NOTES
      //------------------------------

      .state ('billing.DN-edit', {
        data: {
          access: '@'
        },
        url: '/debit-note/edit/:id',
        controller: 'debitNoteEditCtrl as vm',
        templateUrl: 'views/debit-note-edit.html'
      })
      .state ('billing.DN-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/debit-note/new',
        controller: 'debitNoteEditCtrl as vm',
        templateUrl: 'views/debit-note-edit.html'
      })


      //------------------------------
      // IAT
      //------------------------------

      .state ('billing.IAT-edit', {
        data: {
          access: '@'
        },
        url: '/IAT/edit/:id',
        controller: 'IATEditCtrl as vm',
        templateUrl: 'views/iat-edit.html'
      })
      .state ('billing.IAT-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/IAT/new',
        controller: 'IATEditCtrl as vm',
        templateUrl: 'views/iat-edit.html'
      })

      //------------------------------
      // TRANSACTIONS
      //------------------------------

      .state ('billing.transactions-list', {
        data: {
          access: '@'
        },
        url: '/transactions/:type',
        controller: 'transactionListCtrl as vm',
        templateUrl: 'views/transaction-list.html'
      })

      //------------------------------
      // FEE TRANSFERS
      //------------------------------

      .state ('billing.fee-transfers-list', {
        data: {
          access: '@'
        },
        url: '/fee-transfers',
        controller: 'feeTransListCtrl as vm',
        templateUrl: 'views/fee-transfer-list.html'
      })

      .state ('billing.fee-transfers-edit', {
        data: {
          access: '@'
        },
        url: '/fee-transfer/edit/:id',
        controller: 'feeTransEditCtrl as vm',
        templateUrl: 'views/fee-transfer-edit.html'
      })
      .state ('billing.fee-transfers-new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/fee-transfer/new',
        controller: 'feeTransEditCtrl as vm',
        templateUrl: 'views/fee-transfer-edit.html'
      })

      //------------------------------
      // PRESET BILLS
      //------------------------------

      .state ('billing.presetbills-list', {
        data: {
          access: '@'
        },
        url: '/presetbills',
        controller: 'presetbillListCtrl as vm',
        templateUrl: 'views/presetbill-list.html'
      })

      .state ('billing.presetbills-edit', {
        data: {
          access: '@'
        },
        url: '/presetbill/edit/:id',
        controller: 'presetbillEditCtrl as vm',
        templateUrl: 'views/presetbill-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('billing.presetbills-new', {
        data: {
          access: '@'
        },
        url: '/presetbill/new',
        controller: 'presetbillEditCtrl as vm',
        templateUrl: 'views/presetbill-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })

      .state ('billing.items-list', {
        data: {
          access: '@'
        },
        url: '/items',
        controller: 'billingitemListCtrl as vm',
        templateUrl: 'views/billingitem-list.html'
      })

      .state ('billing.items-edit', {
        data: {
          access: '@'
        },
        url: '/item/edit/:id',
        controller: 'billingitemEditCtrl as vm',
        templateUrl: 'views/billingitem-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('billing.items-new', {
        data: {
          access: '@',
        },
        url: '/item/new',
        controller: 'billingitemEditCtrl as vm',
        templateUrl: 'views/billingitem-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })

      //------------------------------
      // PAYMENT RECORDS
      //------------------------------

      .state ('payment-records', {
        data: {
          access: '@'
        },
        url: '/payment-records',
        templateUrl: 'views/common.html'
      })

      .state ('payment-records.list', {
        data: {
          access: '@'
        },
        url: '/:fileNo',
        controller: 'paymentRecordListCtrl as vm',
        templateUrl: 'views/payment-record-list.html'
      })

      .state ('payment-records.edit', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName/edit/:id',
        controller: 'paymentRecordEditCtrl as vm',
        templateUrl: 'views/payment-record-edit.html'
      })

      .state ('payment-records.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/:fileNo/:fileName/new',
        controller: 'paymentRecordEditCtrl as vm',
        templateUrl: 'views/payment-record-edit.html'
      })

      //------------------------------
      // ACCOUNTS
      //------------------------------

      .state ('accounts', {
        data: {
          access: '@'
        },
        url: '/accounts',
        templateUrl: 'views/common.html'
      })

      .state ('accounts.list', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName',
        controller: 'accountListCtrl as vm',
        templateUrl: 'views/account-list.html'
      })

      .state ('accounts.list2', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName/:category',
        controller: 'ledgerListCtrl as vm',
        templateUrl: 'views/ledger-list.html'
      })

      //------------------------------
      // NOTES
      //------------------------------

      .state ('notes', {
        data: {
          access: '@'
        },
        url: '/notes',
        templateUrl: 'views/common.html'
      })

      .state ('notes.list', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName',
        controller: 'noteListCtrl as vm',
        templateUrl: 'views/note-list.html'
      })

      .state ('notes.edit', {
        data: {
          access: '@'
        },
        url: '/:fileNo/:fileName/edit/:id',
        controller: 'noteEditCtrl as vm',
        templateUrl: 'views/note-edit.html'
      })
      .state ('notes.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/:fileNo/:fileName/new',
        controller: 'noteEditCtrl as vm',
        templateUrl: 'views/note-edit.html'
      })

      //------------------------------
      // PROPERTIES
      //------------------------------

      .state ('properties', {
        data: {
          access: '@'
        },
        url: '/properties',
        templateUrl: 'views/common.html'
      })

      .state ('properties.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'propertyListCtrl as vm',
        templateUrl: 'views/property-list.html'
      })

      .state ('properties.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'propertyEditCtrl as vm',
        templateUrl: 'views/property-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('properties.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'propertyEditCtrl as vm',
        templateUrl: 'views/property-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })
      .state ('properties.matters', {
        data: {
          access: '@',
          type: 'property'
        },
        url: '/:id/matters',
        controller: 'relatedMatterCtrl as vm',
        templateUrl: 'views/matter-list.html',
      })

      //------------------------------
      // OCCUPATIONS
      //------------------------------

      .state ('occupations', {
        data: {
          access: '@'
        },
        url: '/occupations',
        templateUrl: 'views/common.html'
      })

      .state ('occupations.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'occupationListCtrl as vm',
        templateUrl: 'views/occupation-list.html'
      })

      .state ('occupations.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'occupationEditCtrl as vm',
        templateUrl: 'views/occupation-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('occupations.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'occupationEditCtrl as vm',
        templateUrl: 'views/occupation-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      }) 


      //------------------------------
      // IRD-branches
      //------------------------------

      .state ('IRD-branches', {
        data: {
          access: '@'
        },
        url: '/IRD-branches',
        templateUrl: 'views/common.html'
      })

      .state ('IRD-branches.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'IRDBranchListCtrl as vm',
        templateUrl: 'views/ird-branch-list.html'
      })

      .state ('IRD-branches.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'IRDBranchEditCtrl as vm',
        templateUrl: 'views/ird-branch-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('IRD-branches.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'IRDBranchEditCtrl as vm',
        templateUrl: 'views/ird-branch-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // CITIES
      //------------------------------

      .state ('cities', {
        data: {
          access: '@'
        },
        url: '/cities',
        templateUrl: 'views/common.html'
      })

      .state ('cities.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'cityListCtrl as vm',
        templateUrl: 'views/city-list.html'
      })

      .state ('cities.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'cityEditCtrl as vm',
        templateUrl: 'views/city-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('cities.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'cityEditCtrl as vm',
        templateUrl: 'views/city-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // STAFFS
      //------------------------------

      .state ('staffs', {
        data: {
          access: '@'
        },
        url: '/staffs',
        templateUrl: 'views/common.html'
      })

      .state ('staffs.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'staffListCtrl as vm',
        templateUrl: 'views/staff-list.html'
      })

      .state ('staffs.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'staffEditCtrl as vm',
        templateUrl: 'views/staff-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('staffs.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'staffEditCtrl as vm',
        templateUrl: 'views/staff-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // BANKS
      //------------------------------

      .state ('banks', {
        data: {
          access: '@'
        },
        url: '/banks',
        templateUrl: 'views/common.html'
      })

      .state ('banks.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'bankListCtrl as vm',
        templateUrl: 'views/bank-list.html'
      })

      .state ('banks.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'bankEditCtrl as vm',
        templateUrl: 'views/bank-edit.html'
      })
      .state ('banks.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'bankEditCtrl as vm',
        templateUrl: 'views/bank-edit.html'
      })

      //------------------------------
      // BANK BRANCHES
      //------------------------------

      .state ('bank-branches', {
        data: {
          access: '@'
        },
        url: '/bank-branches',
        templateUrl: 'views/common.html'
      })

      .state ('bank-branches.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'bankBranchListCtrl as vm',
        templateUrl: 'views/bank-branch-list.html'
      })

      .state ('bank-branches.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'bankBranchEditCtrl as vm',
        templateUrl: 'views/bank-branch-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('bank-branches.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'bankBranchEditCtrl as vm',
        templateUrl: 'views/bank-branch-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // bank-CACs
      //------------------------------

      .state ('bank-CACs', {
        data: {
          access: '@'
        },
        url: '/bank-CACs',
        templateUrl: 'views/common.html'
      })

      .state ('bank-CACs.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'bankCACListCtrl as vm',
        templateUrl: 'views/bank-cac-list.html'
      })

      .state ('bank-CACs.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'bankCACEditCtrl as vm',
        templateUrl: 'views/bank-cac-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('bank-CACs.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'bankCACEditCtrl as vm',
        templateUrl: 'views/bank-cac-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // BANK-ATTORNEYS
      //------------------------------

      .state ('bank-attorneys', {
        data: {
          access: '@'
        },
        url: '/bank-attorneys',
        templateUrl: 'views/common.html'
      })

      .state ('bank-attorneys.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'bankAttorneyListCtrl as vm',
        templateUrl: 'views/bank-attorney-list.html'
      })

      .state ('bank-attorneys.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'bankAttorneyEditCtrl as vm',
        templateUrl: 'views/bank-attorney-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('bank-attorneys.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'bankAttorneyEditCtrl as vm',
        templateUrl: 'views/bank-attorney-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // LEGAL-FIRMS
      //------------------------------

      .state ('legal-firms', {
        data: {
          access: '@'
        },
        url: '/legal-firms',
        templateUrl: 'views/common.html'
      })

      .state ('legal-firms.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'legalFirmListCtrl as vm',
        templateUrl: 'views/legal-firm-list.html'
      })

      .state ('legal-firms.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'legalFirmEditCtrl as vm',
        templateUrl: 'views/legal-firm-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('legal-firms.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'legalFirmEditCtrl as vm',
        templateUrl: 'views/legal-firm-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // JUDGES
      //------------------------------

      .state ('judges', {
        data: {
          access: '@'
        },
        url: '/judges',
        templateUrl: 'views/common.html'
      })

      .state ('judges.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'judgeListCtrl as vm',
        templateUrl: 'views/judge-list.html'
      })

      .state ('judges.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'judgeEditCtrl as vm',
        templateUrl: 'views/judge-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('judges.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'judgeEditCtrl as vm',
        templateUrl: 'views/judge-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // SARS
      //------------------------------

      .state ('sars', {
        data: {
          access: '@'
        },
        url: '/sars',
        templateUrl: 'views/common.html'
      })

      .state ('sars.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'sarListCtrl as vm',
        templateUrl: 'views/sar-list.html'
      })

      .state ('sars.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'sarEditCtrl as vm',
        templateUrl: 'views/sar-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('sars.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'sarEditCtrl as vm',
        templateUrl: 'views/sar-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // COURTS
      //------------------------------

      .state ('courts', {
        data: {
          access: '@'
        },
        url: '/courts',
        templateUrl: 'views/common.html'
      })

      .state ('courts.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'courtListCtrl as vm',
        templateUrl: 'views/court-list.html'
      })

      .state ('courts.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'courtEditCtrl as vm',
        templateUrl: 'views/court-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('courts.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'courtEditCtrl as vm',
        templateUrl: 'views/court-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })

      //------------------------------
      // LAND-OFFICES
      //------------------------------

      .state ('land-offices', {
        data: {
          access: '@'
        },
        url: '/land-offices',
        templateUrl: 'views/common.html'
      })

      .state ('land-offices.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'landOfficeListCtrl as vm',
        templateUrl: 'views/land-office-list.html'
      })

      .state ('land-offices.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'landOfficeEditCtrl as vm',
        templateUrl: 'views/land-office-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('land-offices.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/new',
        controller: 'landOfficeEditCtrl as vm',
        templateUrl: 'views/land-office-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })


      //------------------------------
      // LAND-PTGS
      //------------------------------

      .state ('land-PTGs', {
        data: {
          access: '@'
        },
        url: '/land-PTGs',
        templateUrl: 'views/common.html'
      })
      .state ('land-PTGs.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'landPTGListCtrl as vm',
        templateUrl: 'views/land-ptg-list.html'
      })
      .state ('land-PTGs.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'landPTGEditCtrl as vm',
        templateUrl: 'views/land-ptg-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return false;
          }
        }
      })
      .state ('land-PTGs.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'landPTGEditCtrl as vm',
        templateUrl: 'views/land-ptg-edit.html',
        resolve: {
          "$uibModalInstance": function () {
            return null;
          },
          entityCode: function () {
            return null;
          },
          isDialog: function () {
            return false;
          },
          isNew: function () {
            return true;
          }
        }
      })

      //------------------------------
      // BUILDINGS
      //------------------------------

      .state ('buildings', {
        data: {
          access: '@'
        },
        url: '/buildings',
        templateUrl: 'views/common.html'
      })

      .state ('buildings.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'buildingListCtrl as vm',
        templateUrl: 'views/building-list.html'
      })

      .state ('buildings.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'buildingEditCtrl as vm',
        templateUrl: 'views/building-edit.html'
      })
      .state ('buildings.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'buildingEditCtrl as vm',
        templateUrl: 'views/building-edit.html'
      })


      //------------------------------
      // PROJECTS
      //------------------------------

      .state ('projects', {
        data: {
          access: '@'
        },
        url: '/projects',
        templateUrl: 'views/common.html'
      })

      .state ('projects.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'projectListCtrl as vm',
        templateUrl: 'views/project-list.html'
      })

      .state ('projects.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'projectEditCtrl as vm',
        templateUrl: 'views/project-edit.html'
      })
      .state ('projects.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/new',
        controller: 'projectEditCtrl as vm',
        templateUrl: 'views/project-edit.html'
      })


      //------------------------------
      // MUKIMS
      //------------------------------

      .state ('mukims', {
        data: {
          access: '@'
        },
        url: '/mukims',
        templateUrl: 'views/common.html'
      })

      .state ('mukims.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'mukimListCtrl as vm',
        templateUrl: 'views/mukim-list.html'
      })

      .state ('mukims.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'mukimEditCtrl as vm',
        templateUrl: 'views/mukim-edit.html'
      })
      .state ('mukims.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'mukimEditCtrl as vm',
        templateUrl: 'views/mukim-edit.html'
      })


      //------------------------------
      // LOAN-TYPES
      //------------------------------

      .state ('loan-types', {
        data: {
          access: '@'
        },
        url: '/loan-types',
        templateUrl: 'views/common.html'
      })

      .state ('loan-types.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'loanTypeListCtrl as vm',
        templateUrl: 'views/loan-type-list.html'
      })

      .state ('loan-types.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'loanTypeEditCtrl as vm',
        templateUrl: 'views/loan-type-edit.html'
      })
      .state ('loan-types.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'loanTypeEditCtrl as vm',
        templateUrl: 'views/loan-type-edit.html'
      })


      //------------------------------
      // CKHTs
      //------------------------------

      .state ('CKHTs', {
        data: {
          access: '@'
        },
        url: '/CKHTs',
        templateUrl: 'views/common.html'
      })

      .state ('CKHTs.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'CKHTListCtrl as vm',
        templateUrl: 'views/ckht-list.html'
      })

      .state ('CKHTs.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'CKHTEditCtrl as vm',
        templateUrl: 'views/ckht-edit.html'
      })
      .state ('CKHTs.new', {
        data: {
          access: '@'
        },
        url: '/new',
        controller: 'CKHTEditCtrl as vm',
        templateUrl: 'views/ckht-edit.html'
      })

      //------------------------------
      // COURT DIARY
      //------------------------------

      .state ('courtdiary', {
        data: {
          access: '@'
        },
        url: '/courtdiary/:keyword',
        templateUrl: 'views/courtdiary-list.html'
      })

      .state ('courtdiaries', {
        data: {
          access: '@'
        },
        url: '/courtdiaries',
        templateUrl: 'views/common.html'
      })
      .state ('courtdiaries.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'courtdiaryEditCtrl as vm',
        templateUrl: 'views/courtdiary-edit.html'
      })
      .state ('courtdiaries.new', {
        data: {
          access: '@',
          can_edit: true
        },
        url: '/new',
        controller: 'courtdiaryEditCtrl as vm',
        templateUrl: 'views/courtdiary-edit.html'
      })


      //------------------------------
      // SPA CHECKLIST ITEMS
      //------------------------------

      .state ('spaclitems', {
        data: {
          access: '@'
        },
        url: '/spaclitems',
        templateUrl: 'views/common.html'
      })

      .state ('spaclitems.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'spaclitemListCtrl as vm',
        templateUrl: 'views/spa-checklist-item-list.html'
      })

      .state ('spaclitems.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'spaclitemEditCtrl as vm',
        templateUrl: 'views/spa-checklist-item-edit.html'
      })
      .state ('spaclitems.new', {
        data: {
          access: '@'
        },
        url: '/edit/',
        controller: 'spaclitemEditCtrl as vm',
        templateUrl: 'views/spa-checklist-item-edit.html'
      })

      //------------------------------
      // SPA PRESET CHECKLISTS
      //------------------------------

      .state ('spapresetcls', {
        data: {
          access: '@'
        },
        url: '/spapresetcls',
        templateUrl: 'views/common.html'
      })

      .state ('spapresetcls.list', {
        data: {
          access: '@'
        },
        url: '/',
        controller: 'spapresetclListCtrl as vm',
        templateUrl: 'views/spa-preset-checklist-list.html'
      })

      .state ('spapresetcls.edit', {
        data: {
          access: '@'
        },
        url: '/edit/:id',
        controller: 'spapresetclEditCtrl as vm',
        templateUrl: 'views/spa-preset-checklist-edit.html'
      })
      .state ('spapresetcls.new', {
        data: {
          access: '@'
        },
        url: '/edit/',
        controller: 'spapresetclEditCtrl as vm',
        templateUrl: 'views/spa-preset-checklist-edit.html'
      })


      //------------------------------
      // SPA CHECKLIST CALENDAR
      //------------------------------

      .state ('spa-checklist-calendar', {
        data: {
          access: '@'
        },
        url: '/spa-checklist-calendar',
        templateUrl: 'views/spa-checklist-calendar.html',
        controller: 'spapresetclListCtrl as vm'
      })

      //------------------------------
      // LITIGATION CHECKLIST CALENDAR
      //------------------------------

      .state ('litigation-checklist-calendar', {
        data: {
          access: '@'
        },
        url: '/litigation-checklist-calendar',
        templateUrl: 'views/litigation-checklist-calendar.html',
        controller: 'spapresetclListCtrl as vm'
      })
  });
