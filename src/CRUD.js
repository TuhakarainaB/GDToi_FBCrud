import {useState, useEffect} from 'react';
import {db} from './fbconfig';
import {addDoc, collection, doc, getDocs, deleteDoc, updateDoc} from 'firebase/firestore';
import {storage} from './fbconfig'; // #1 for storing images
import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage'; // #2 for storing images
import {Link} from 'react-router-dom';

function CRUD()
{
    const [dataName, setDataName] = useState("");
    const [dataDescription, setDataDescription] = useState("");
    const [dataContainment, setDataContainment] = useState("");

    const[readData, setReadData] = useState([]);

    const[id, setId] = useState("");
    const[showDoc, setShowDoc] = useState(false);

    // #3 for storing images
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");

    // useStates for CRUD operation messages
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);


    const OurCollection = collection(db, "data");

    useEffect(() => {
        const getData = async () =>
        {
            const ourDocsToRead = await getDocs(OurCollection);
            setReadData(
                ourDocsToRead.docs.map(
                    doc=>({...doc.data(), id:doc.id})
                )
            );
        }
        getData()
    }, []);

    const crudCreate = async () => {

        setLoading(true);

        try{
           const docRef = await addDoc(OurCollection, {Name:dataName, Description:dataDescription, Containment:dataContainment});
            // Declare newData here
            const newData = {Name: dataName, Description: dataDescription, Containment: dataContainment, id: docRef.id};
            // shows changes instantly without refreshing page.
            setReadData(prev => [...prev, newData]); 
            setMessage("Record succesfully created!");
            setIsError(false);
        }
        catch(error)
        {
            setMessage("Error creating record!");
            setIsError(true);
        }
        finally 
        {
            setLoading(false);
            setTimeout(()=>setMessage(""), 3000); // reset the message after 3 seconds
        }
    }

    const crudDelete = async (id) =>
    {
        setLoading(true);

        try
        {
            const docToDelete = doc(db, "data", id);
            await deleteDoc(docToDelete);
            // Remove the deleted record from state shows up instantly with refreshing page
            setReadData(prev => prev.filter(data => data.id !== id)); 
            setMessage("Record successfully deleted");
            setIsError(false);
        }
        catch(error)
        {
            setMessage("Error Deleting Record!");
            setIsError(true);
        }
        finally
        {
            setLoading(false);
            setTimeout(()=>setMessage(""), 3000);
        }
    }

    // add for edit button, this will show document/record in the main form
    const showEdit = (id, Name, Description, Containment, imageURL) => {
        setDataName(Name);
        setDataDescription(Description);
        setDataContainment(Containment);
        setImageURL(imageURL);
        setId(id);
        setShowDoc(true);
    }

    // update document that is shown in the main form
    const crudUpdate = async () => {

        setLoading(true);

        try{
            const updateData = doc(db, "data", id);
            await updateDoc(updateData, {Name:dataName, Description:dataDescription, Containment:dataContainment, imageURL: imageURL});
            // Updated records shows instantly 
            setReadData(prev => prev.map(data => data.id === id ? {...data, Name: dataName, Description: dataDescription, Containment: dataContainment, imageURL: imageURL} : data));
            setMessage("Record Updated Successfully");
            setIsError(false);
        }   
        catch(error)
        {
            setMessage("Error Updating Record");
            setIsError(true);
        }
        finally
        {
            setLoading(false);
            setShowDoc(false);
            setDataName("");
            setDataDescription("");
            setDataContainment("");
            setTimeout(()=>setMessage(""), 3000);
        }
    }

    // #4 for uploading and storing images
    const handleImageChange = (e) => {
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }
    }

    // #5 for uploading and storing images
    const uploadImage = async () => {

        setLoading(true);
        try
        {
            const storageRef = ref(storage, 'images/' + image.name);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
            // Progress function
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload ' + progress + '% done.');
            },
            // error function
            (error) => {
                setLoading(false);
                setMessage("Error Uploading Image!");
                setIsError(true);
                setTimeout(()=>setMessage(""), 3000);
            },
            // complete the function
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImageURL(downloadURL);
                setMessage("Image successfully uploaded!");
                setIsError(false);
                setLoading(false);
                setTimeout(()=>setMessage(""), 3000);
            }
        );
        }
        catch(error)
        {
            setLoading(false);
            setMessage("Error uploading image!");
            setIsError(true);
            setTimeout(()=>setMessage(""), 3000);
        }
    }

    return(
        <>
        <h1>CRUD Functions Form</h1>
        <p><Link to="/">
                <button type="button" className="btn btn-primary">Back to FrontPage</button>
            </Link>
        </p>
        <div className="form-group p-5 bg-dark rounded">
            <input className="form-control" value={dataName} onChange={(name) => setDataName(name.target.value)} placeholder='Name'/>
            <br />
            <br />
            <input className="form-control" value={dataDescription} onChange={(description) => setDataDescription(description.target.value)} placeholder='Description' />
            <br />
            <br />
            <input className="form-control" value={dataContainment} onChange={(containment) => setDataContainment(containment.target.value)} placeholder='Containment' />
            <br />
            <br />
            <input className="form-control" type="file" onChange={handleImageChange} />
            <br />
            <button onClick={uploadImage} className="btn btn-secondary">Upload Image</button>
        </div>
            {loading && <p>Loading...</p>}
            {
                message &&
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                {message}
                </div>
            }
            {imageURL && <img src={imageURL} alt="Uploaded Preview" style={{maxWidth: "200px", height: "auto"}} />}
            <br /> <br />
            {!showDoc?<button onClick={crudCreate} className="btn btn-primary">Create new document</button>:
            <button onClick={crudUpdate} className="btn btn-dark">Update document</button>}
            <hr />
            {
                readData.map(
                    values => (
                        <div key={values.id}>
                            <h1>{values.Name}</h1>
                            <p><strong>Description:</strong> {values.Description}</p>
                            <p><strong>Containment:</strong> {values.Containment}</p>
                            <p>{values.imageURL && <img src={values.imageURL} style={{maxWidth: "200px", height: "auto"}} />}</p>
                            <button onClick={()=>crudDelete(values.id)} className="btn btn-danger">Delete</button>
                            {' '}
                            <button onClick={()=>showEdit(values.id, values.Name, values.Description, values.Containment, values.imageURL)} className="btn btn-warning">Edit</button>
                        </div>
                    )
                )
            }
        </>

    );
}

export default CRUD;
