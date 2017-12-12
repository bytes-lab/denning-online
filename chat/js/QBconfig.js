var QBconfig = {
    credentials: {
        appId: 55869,
        authKey: 'tpH4TbFKOcmrYet',
        authSecret: 'Tctz5xEDNWuJQq4'
    },
    appConfig: {
        chatProtocol: {
            active: 2
        },
        streamManagement: {
            enable: true
        },
        debug: {
            mode: 1,
            file: null
        }
    }
};

var appConfig = {
    dilogsPerRequers: 1000,
    messagesPerRequest: 50,
    usersPerRequest: 15,
    typingTimeout: 3 // 3 seconds
};

var CONSTANTS = {
    DIALOG_TYPES: {
        CHAT: 3,
        GROUPCHAT: 2,
        PUBLICCHAT: 1
    },
    ATTACHMENT: {
        TYPE: 'audio',
        BODY: '[attachment]',
        MAXSIZE: 10 * 1000000, // set 2 megabytes,
        MAXSIZEMESSAGE: 'Image is too large. Max size is 2 mb.'
    },
    NOTIFICATION_TYPES: {
        NEW_DIALOG: '1',
        UPDATE_DIALOG: '2'
    }
};
