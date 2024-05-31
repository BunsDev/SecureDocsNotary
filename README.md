# SecureDocsNotary

SecureDocsNotary is the front-end application for document verification within the SecureDocs project. This application allows users to verify the integrity and authenticity of documents using blockchain technology.

## Frontend

### `index.js`

This page serves as the entry point of the application, offering users the option to go to the login page.

### `verifierLogin.js`

This page is used for logging in with Web3Auth. After login, the application checks if the user has an account in the database. If the account exists, the user is redirected to the home page (`home.js`). If not, the user is redirected to the sign-up page (`verifierSignup.js`) to create an account.

### `verifierSignup.js`

This page allows new verifiers to sign up and create an account. Users need to provide necessary details to complete their registration and gain access to the verification functionalities.

### `home.js`

This page is the main dashboard for verifiers. After logging in, verifiers can view and manage documents that need verification.

### `verify/[documentId].js`

This page allows verifiers to review the details of a document and perform the verification process. Verifiers can approve documents and mint a new NFT to the secure vault of the user.

### `account.js`

This page allows verifiers to see their personal information.

## Installation

To set up and run the SecureDocsNotary application locally, follow these steps:

### 1. **Clone the Repository**:

```
git clone https://github.com/SecureDocsChain/SecureDocsNotary.git
```

### 2. **Install Dependencies**:

Navigate to the project directory and install the required dependencies.

```
cd SecureDocsNotary
npm install
```

### 3. **Run the Application**:

Start the development server.

```
npm run dev
```

### 4. **Open in Browser**:

Open your browser and navigate to http://localhost:3000 to see the application in action.

## Usage

### Logging In

1. **Navigate to the login page**

   - Go to the `verifierLogin.js` page.
   - Click on the login option to authenticate using Web3Auth.

2. **Authentication Check**
   - After logging in, the application will check if you have an account in the database.
   - If your account exists, you will be redirected to the home page (`home.js`).
   - If you do not have an account, you will be redirected to the sign-up page (`verifierSignup.js`).

### Verifying Documents

1. **Access the Home Page**

   - After logging in, go to the `home.js` page.
   - You will see a list of documents that need verification.

2. **Select a Document**

   - Choose a document from the list that you want to verify.

3. **Verify the Document**
   - On the `verify/[documentId].js` page, review the document details.
   - Approve the document.
