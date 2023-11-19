import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getDocs, collection} from 'firebase/firestore';
import {db} from './fbconfig';

function FrontPage()
{
   const [menuItems, setMenuItems] = useState([]);

   useEffect(
    () => {
        const fetchMenuItems = async () =>
        {
            const dataCollection = collection(db, "data");
            const dataSnapShot = await getDocs(dataCollection);
            const items = dataSnapShot.docs.map(doc => ({id: doc.id, ...doc.data()}));

            setMenuItems(items);
        }
        fetchMenuItems();
    }, []
   );

   return (
    <div>
    <h1>Welcome to the CRUD Application</h1>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
     <button className="navbar-toggler" type="button" data-bs-
      toogle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
      aria-expanded="false" aria-label="Toggle Navigation">
      <span className="navbar-toggler-icon"></span>
     </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
                {
                 menuItems.map(
                 item => (
                          <li className="nav-item" key={item.id}>
                          <Link className="nav-link"
                           to={`/document/${item.id}`}>{item.Name}</Link>
                          </li>
                        )
                    )
                }
                <li className="nav-item">
                    <Link className="btn btn-danger" to="/CRUD">CRUD
                     Functions</Link>
                </li>
         </ul>
         </div>
        </div>
    </nav>
</div>

   );

}

export default FrontPage;