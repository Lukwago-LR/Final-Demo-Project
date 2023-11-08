function AlpineMainFunction() {
    return {
        username: "",
        password: "",
        login: false,
        logout: true,
        account: false,
        classification: false,
        image3D: false,
        augmentation: false,
        homePage: true,
        toggle: false,
        camera: false,
        response: "",
        srcData: "",
        prediction: "",
        load: false,
        feed: "",
        Norm: false,
        Malig: false,
        Beg: false,

        navigateToNewPage() {
            window.location.href = 'https://lukwago-lr.github.io/Augmented-Reality-FYP/'
        },

        predict() {
            this.load = true;
            axios.get('/api/predict')
                .then(response => {
                    this.prediction = response.data.predictions
                    this.load = false;
                    
                    if(this.prediction.includes('Norm') && this.prediction.includes('Beng') && this.prediction.includes('Malig')){
                        this.Malig = true;
                        this.Beg = true;
                        this.Norm = true;
                    }
                    else if(this.prediction.includes('Norm') && this.prediction.includes('Malig')){
                        this.Norm = true;
                        this.Malig = true;
                    }else if(this.prediction.includes('Norm') && this.prediction.includes('Beng')){
                        this.Norm = true;
                        this.Beg = true
                    }else if(this.prediction.includes('Malig') && this.prediction.includes('Beng')){
                        this.Malig = true;
                        this.Beg = true
                    }else if(this.prediction.includes('Norm')){
                        this.Norm = true;
                    }else if(this.prediction.includes('Malig')){
                        this.Malig = true;
                    }else if(this.prediction.includes('Beng')){
                        this.Beg = true;
                    }

                })
                .catch(function (error) {
                    // Handle any errors
                    console.error('Error:', error);
                });
        },

        LoggingOut() {
            this.logout = true;
            this.login = false;

            localStorage['login'] = this.login;
            localStorage['logout'] = this.logout;
        },

        init() {
            let name = localStorage.getItem['username'];
            let pass = localStorage.getItem['password'];
            let inside = localStorage.getItem['login'];

            if ((name != "" || pass != "") && inside == true) {
                this.login = true;
                this.logout = false;
            }
        },

        authentication() {
            if (this.username != "" || this.password != "") {
                this.login = true;
                this.logout = false;

                localStorage.setItem['login', this.login];
                localStorage.setItem['logout', this.logout];

                localStorage.setItem['username', this.username];
                localStorage.setItem['password', this.password];

            } else {

                this.feed = "Invalid username or password"
            }

        },

        openAccount() {
            this.account = true;
            this.closeSection('account');
        },

        openClassification() {
            this.classification = true;
            this.closeSection('classification');
        },

        open3D() {
            this.image3D = true;
            this.closeSection('image3D');
        },

        openCamera() {
            this.camera = true;
            this.closeSection('camera');
        },

        openAugmentation() {
            this.augmentation = true;
            this.closeSection('augmentation');
        },

        openHome(currentSection) {
            this.homePage = true;
            if (currentSection == "account") {
                this.account = false;
            } else if (currentSection == "classification") {
                this.classification = false;
            } else if (currentSection == "image3D") {
                this.image3D = false;
            } else if (currentSection == "augmentation") {
                this.augmentation = false;
            } else if (currentSection == "camera") {
                this.camera = false;
            } else {
                console.log('section could not be found')
            }
        },

        closeSection(openSection) {
            if (openSection == "account") {
                this.classification = false;
                this.image3D = false;
                this.homePage = false;
                this.augmentation = false;
                this.camera = false;
            } else if (openSection == "classification") {
                this.account = false;
                this.image3D = false;
                this.homePage = false;
                this.augmentation = false;
                this.camera = false;
            } else if (openSection == "image3D") {
                this.account = false;
                this.classification = false;
                this.homePage = false;
                this.augmentation = false;
                this.camera = false;
            } else if (openSection == "augmentation") {
                this.account = false;
                this.image3D = false;
                this.homePage = false;
                this.classification = false;
                this.camera = false;
            } else if (openSection == "camera") {
                this.account = false;
                this.image3D = false;
                this.homePage = false;
                this.classification = false;
                this.augmentation = false;
            } else {
                console.log('section could not be found')
            }
        }
    }
}

document.addEventListener('alpine:init', () => {
    Alpine.data('mainFunction', AlpineMainFunction)
})