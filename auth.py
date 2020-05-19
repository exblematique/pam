import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

#Atuh with json
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Use the application default credentials
"""cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
      'projectId': 'pam-iot',
    })
"""

db = firestore.client()
data = {
        u'name': u'Los Angeles',
        u'state': u'CA',
        u'country': u'USA'
    }

# Add a new doc in collection 'cities' with ID 'LA'
db.collection(u'cities').document(u'LA').set(data)
