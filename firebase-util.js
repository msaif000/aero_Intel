// const db = require('./firebase-db-connect');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

async function saveNewsFromRequest(data) {
    try{
        const db = getFirestore();
        const batch = db.batch();

        data.forEach((news) => {
            const { company, headline, link, summary  } = news;
            const newsRef = db.collection('News').doc();
            batch.set(newsRef, { 
                company, headline, link, summary, 
                dateTime: FieldValue.serverTimestamp()
             });
        });

        await batch.commit();
        return 'success';
    } catch(err) {
        return err.message;
    }
}

async function updateStatsFromRequest(data) {
    try{
        const db = getFirestore();

        const { company, good, bad, veryGood, veryBad, neutral } = data;
        const statsRef = db.collection('Stats').doc(company);

        await db.runTransaction(async(t) => {
            const doc = await t.get(statsRef);
            const docData = doc.data();
            const updatedData = {
                good: (docData.good || 0) + good,
                bad: (docData.bad || 0) + bad,
                verygood: (docData.verygood || 0) + veryGood,
                verybad: (docData.verybad || 0) + veryBad,
                neutral: (docData.neutral || 0) + neutral,
              };

            t.set(statsRef, updatedData);
        });
        return 'success';
    } catch(err) {
        return err.message;
    }
}



module.exports = {
    saveNewsFromRequest,
    updateStatsFromRequest,
}