const db = require('../DB/db.js');


const fetchAll =  async (req, res)=>{
    try {
        const userId = req.params.id;
        const responses = await db.query('SELECT * FROM contacts WHERE user_id = $1 ORDER BY nom ASC ',[userId]);
        if(!responses.rows){
            return res.status(200).json({message:"No data found"});
        }
        return res.status(200).json({message:"data fetched", data:responses.rows})
        
    } catch (error) {
        console.log(error)
    }
}   

const createContact =  async (req, res)=>{
    try {
        const {nom, tel, addresse, email} = req.body;
        const userId = req.params.id;

        const responses = await db.query('INSERT INTO contacts (nom,tel,addresse,email,user_id) VALUES($1,$2,$3,$4,$5) RETURNING *',[nom,tel,addresse,email,userId]);
        if(!responses.rows){
            return res.status(200).json({message:"No data added"});
        }
        return res.status(200).json({message:"data posted", data:responses.rows[0]})
        
    } catch (error) {
        console.log(error);
         return res.status(500).json({
        message: error.message
    });
    }
}   
const updateContact =  async (req, res)=>{
    try {
        const {nom, tel, addresse, email} = req.body;
        const id = req.params.id;
        
        if (!id) {
        return res.status(400).json({ message: "L'ID du contact est requis." });
    }

        const responses = await db.query('UPDATE contacts SET nom = $1,tel = $2,addresse = $3 ,email = $4  WHERE id = $5 RETURNING *',[nom,tel,addresse,email,id]);
        if(!responses.rows){
            return res.status(200).json({message:"No data added"});
        }
        return res.status(200).json({message:"data updated"})
        
    } catch (error) {
        console.log(error);
         return res.status(500).json({
        message: error.message
    });
    }
}  
const deleteContact =  async (req, res)=>{
    try {
        const id = req.params.id;

        const responses = await db.query('DELETE FROM contacts WHERE id=$1',[id]);
        if(!responses.rows){
            return res.status(200).json({message:"No data added"});
        }
        return res.status(200).json({message:"data deleted"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        message: error.message
    });
    }
}  

module.exports = {
                    fetchAll,
                    createContact,
                    updateContact,
                    deleteContact
                }; 