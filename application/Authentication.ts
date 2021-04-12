import * as firebase from 'firebase';
import 'firebase/firestore';


interface IRegisterRequest {
    DisplayName: string;
    Email: string;
    Password: string;
}

class Authentication {
    private displayWelcome = true;
    private displayNameWelcome = "";

    /**
     * Display the user welcome message upon app loading
     * this will also ensure its only displayed once!
     */
    public DisplayWelcomeNotification() {
        if (!this.displayWelcome) return;

        let user = firebase.auth().currentUser;

        console.log("Display welcome: ", user?.displayName, this.displayNameWelcome);

        // Check if the displayName on the user is set.
        if (user?.displayName !== undefined && user?.displayName !== null) {
            // User has already registered and is logging in.
            alert("Welcome " + user.displayName);
        } else {
            // If this happens when the user is registering a new account
            alert("Welcome " + this.displayNameWelcome);
        }

        this.displayWelcome = false;
    }

    /**
     * Logout of firebase
     * @returns Promise
     */
    public Logout(): Promise<void> {
        return firebase.auth().signOut();
    }

    /**
     * Login to firebase 
     * @param  {string} email
     * @param  {string} password
     */
    public async Login(email: string, password: string) {
        this.displayWelcome = true;
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }
    
    /**
     * Register a user account in firebase
     * @param  {IRegisterRequest} data
     */
    public async Register(data: IRegisterRequest): Promise<firebase.auth.UserCredential> {
        this.displayWelcome = true;
        this.displayNameWelcome = data.DisplayName;

        const { Email, Password } = data;
        var promise = firebase
            .auth()
            .createUserWithEmailAndPassword(Email, Password);

        promise
            .then((user) => {
                user.user?.updateProfile({
                    displayName: data.DisplayName
                }).then(function () {
                    // Update successful.
                    console.log("Authentication: Updated profile display name");
                }, function (error) {
                    console.error("Authentication: Failed to update displayName", error);
                    
                    // An error happened.
                    alert("Failed to set display name.");
                });
                
                // If the registration was successful
                if (user.user != null) {
                    const {uid} = (user.user as firebase.User);
                    
                    firebase.firestore()
                        .collection('users')
                        .doc(user.user.uid)
                        .set({ userId: uid, displayName: data.DisplayName })
                }
            });

        return promise;
    }

}

export default new Authentication();