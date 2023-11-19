import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {db} from './fbconfig';
import {Link} from 'react-router-dom';

function DisplayDocument()
{
    const {id} = useParams();
    const [documentData, setDocumentData] = useState(null);

    useEffect(
        () => {
            const fetchData = async () => 
            {
                try
                {
                    const docRef = doc(db, "data", id);
                    const docSnapShot = await getDoc(docRef);
                    if(docSnapShot.exists())
                    {
                        setDocumentData(docSnapShot.data());
                    }
                    else
                    {
                        console.error("No such document!");
                    }
                }
                catch(error)
                {
                    console.error("Error fetching document: ", error);
                }
            }
            fetchData();
        }, [id]
    );

    return(
        <div>
            {
                documentData ? (
                    <>
                        <h1>{documentData.Name}</h1>
                        <p>{documentData.imageURL && <img src={documentData.imageURL} alt={documentData.Name} className="border w-50 rounded shadow" />}</p>
                        <p>{documentData.Description}</p>
                        <p>{documentData.Containment}</p>
                        <Link to="/">
                            <button type="button" className="btn btn-primary">Back to Front Page</button>
                        </Link>
                    </>
                  ) : (
                    <p>Loading ...</p>
                  )
            }
        </div>
    );
}

export default DisplayDocument;