
function noop(data) {
    console.log(data)
}

const createReturn = (params, result) => {
    return {
        data() {
          return result
        }
    }
};

console.log(localStorage.getItem('basket'),)
//window.basket = localStorage.getItem('basket') ? JSON.parse(localStorage.getItem('basket')) : [];
window.basket = [];
const app = {}; //todo
const apiHost = 'http://151.248.113.224:8000';
export function apiCall(path, args) {
  // if (path.includes('client')) {
  //   debugger
  // }
  return fetch(apiHost + path, args).then(res => res.json());
}

export const globalState = {
  client_list: [],
};

apiCall('/quest/client_list').then(json => {
  globalState.client_list = json;
})

const isObject = (it) => it != null && typeof it === 'object';
export function toUrlParams(data) {
  console.log(data)
  let value;
  if (!data) return '';
  const serialized = [];
  Object.keys(data).forEach((key) => {
    value = data[key];
    if (value === undefined) return; // continue;
    if (typeof value === 'function') return;
    if (isObject(value)) value = JSON.stringify(value);
    // key and value should be decoded with decodeURIComponent
    serialized.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });
  return `?${serialized.join('&')}`;
}

function getProducts() {
  return Promise.all([
    apiCall('/quest/quest_list'),
    apiCall('/quest/order_list'),
  ]).then(arr => {
    const [quest, order] = arr;
    const result = quest.map(mapItem).map(item => ({
      ...item,
      order_list: order.filter(o => String(o.quest) === item.id).map(o => ({...o, date: o.date.split(' ')[0], _raw_date: o.date}))
    })).sort((a, b) => b.position - a.position);
    //console.log(result)
    return result
  }).then(d => {
    return d.filter(item => {
           return String(item.city) === localStorage.getItem('city');
    });
  })
  // return apiCall('/quest/quest_list').then(data => data.map(mapItem).filter(item => {
  //     return String(item.city) === localStorage.getItem('city');
  // }));
}

function mapItem(item) {
  return {
    ...item,
    id: String(item.id),
    image: apiHost + item.photo,
    imageCollection: [],
    sizes: [],
    availableColors: [],
    //price: 1,
  }
}

class Firebase {
  // constructor() {
  //   app.initializeApp(firebaseConfig);
  //
  //   this.storage = app.storage();
  //   this.db = app.firestore();
  //   this.auth = app.auth();
  // }
  auth = {
      onAuthStateChanged(cb) {
        setTimeout(() => {
          cb({
                id: 'test-123',
              uid: 'such-uid',
                role: 'ADMIN',
                provider: 'password',
              providerData: [{}]
          })
        }, 1000)
      }
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () =>
    this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => this.auth.signOut();

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => this.db.collection("users").doc(id).set(user);

  getUser = (id) => {
    //  getUser = (id) => this.db.collection("users").doc(id).get();

    return createReturn(id, {
        id: 'test-123',
        role: 'USER',
        provider: 'password',
        providerData: [],
        basket: [],
    })
  };

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  updateProfile = (id, updates) =>
    this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS --------------

  getSingleProduct = (id) => {
    //this.db.collection("products").doc(id).get()
      return getProducts().then(data => data.find(item => String(item.id) === id))
  };

  getProducts = (lastRefKey) => {
    return getProducts();

    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const query = this.db
              .collection("products")
              .orderBy(app.firestore.FieldPath.documentId())
              .startAfter(lastRefKey)
              .limit(12);

            const snapshot = await query.get();
            const products = [];
            snapshot.forEach((doc) =>
              products.push({ id: doc.id, ...doc.data() })
            );
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ products, lastKey });
          } catch (e) {
            reject(e?.message || ":( Failed to fetch products.");
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request timeout, please try again"));
          }, 15000);

          try {
            const totalQuery = await this.db.collection("products").get();
            const total = totalQuery.docs.length;
            const query = this.db
              .collection("products")
              .orderBy(app.firestore.FieldPath.documentId())
              .limit(12);
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const products = [];
              snapshot.forEach((doc) =>
                products.push({ id: doc.id, ...doc.data() })
              );
              const lastKey = snapshot.docs[snapshot.docs.length - 1];

              resolve({ products, lastKey, total });
            }
          } catch (e) {
            if (didTimeout) return;
            reject(e?.message || ":( Failed to fetch products.");
          }
        }
      })();
    });
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const productsRef = this.db.collection("products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const searchedNameRef = productsRef
            .orderBy("name_lower")
            .where("name_lower", ">=", searchKey)
            .where("name_lower", "<=", `${searchKey}\uf8ff`)
            .limit(12);
          const searchedKeywordsRef = productsRef
            .orderBy("dateAdded", "desc")
            .where("keywords", "array-contains-any", searchKey.split(" "))
            .limit(12);

          // const totalResult = await totalQueryRef.get();
          const nameSnaps = await searchedNameRef.get();
          const keywordsSnaps = await searchedKeywordsRef.get();
          // const total = totalResult.docs.length;

          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts = [];
            const searchedKeywordsProducts = [];
            let lastKey = null;

            if (!nameSnaps.empty) {
              nameSnaps.forEach((doc) => {
                searchedNameProducts.push({ id: doc.id, ...doc.data() });
              });
              lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
            }

            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
              });
            }

            // MERGE PRODUCTS
            const mergedProducts = [
              ...searchedNameProducts,
              ...searchedKeywordsProducts,
            ];
            const hash = {};

            mergedProducts.forEach((product) => {
              hash[product.id] = product;
            });

            resolve({ products: Object.values(hash), lastKey });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getFeaturedProducts = (itemsCount = 12) => {
      // this.db
      //     .collection("products")
      //     .where("isFeatured", "==", true)
      //     .limit(itemsCount)
      //     .get();
    return getProducts();
  }



  getRecommendedProducts = (itemsCount = 12) => {
      // this.db
      //     .collection("products")
      //     .where("isRecommended", "==", true)
      //     .limit(itemsCount)
      //     .get();
      return []
  }

  addProduct = (id, product) =>
    this.db.collection("products").doc(id).set(product);

  generateKey = () => this.db.collection("products").doc().id;

  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  deleteImage = (id) => this.storage.ref("products").child(id).delete();

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
