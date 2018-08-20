var widget = {
    clear: function() {

        var env = '';
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            env = 'test';
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            env = 'dev';
        }

        window.localStorage.removeItem('apprrs' + env);
        window.localStorage.removeItem('appmassage' + env);
        window.localStorage.removeItem('appparking' + env);
        window.localStorage.removeItem('apprelieve' + env);
    },
    list: function() {
        return [
            { id: 0, name: 'carousel', enabled: true, lang: langStr['wgt_001'] },
            { id: 1, name: 'weather', enabled: true, lang: langStr['wgt_002'] },
            { id: 2, name: 'reserve', enabled: true, lang: langStr['wgt_003'] },
            { id: 3, name: 'message', enabled: true, lang: langStr['wgt_004'] },
            { id: 4, name: 'applist', enabled: true, lang: langStr['wgt_005'] }
        ];
    }
};