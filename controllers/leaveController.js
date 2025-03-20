// import Leave from "../models/Leave.js"



// const addLeave = async (req , res) => {
//     try {
//         const {userId, leaveType, startDate, endDate, reason } = req.body
    
        
//         const newLeave = new Leave({
//             employeeeId : userId, 
//             leaveType, 
//             startDate, 
//             endDate, 
//             reason
    
//         })
//         await newLeave.save()
//         return res.status(200).json({success: true})
    
//     } catch (error) {
    
//         return res.status(500).json({success: false, error: "Leave server error"})
//     }
// }

// export {addLeave}


// const getLeave = async (req, res) => {
//     try {
//         const { id } = req.params; 

//         if (!id) {
//             return res.status(400).json({ success: false, error: "ID utilisateur invalide" });
//         }

//         const employee = await Employee.findOne({ userId: id });

//         if (!employee) {
//             return res.status(404).json({ success: false, error: "Employé non trouvé" });
//         }

//         const leaves = await Leave.find({ employeeId: employee._id });

//         if (leaves.length === 0) {
//             return res.status(200).json({ success: true, message: "Aucun congé trouvé pour cet utilisateur.", leaves });
//         }

//         return res.status(200).json({ success: true, leaves });
//     } catch (error) {
//         console.error("Erreur lors de la récupération des congés:", error);
//         return res.status(500).json({ success: false, error: "Erreur serveur" });
//     }
// };



import Leave from "../models/Leave.js";
import Employee from '../models/Employee.js'; // Assure-toi que c'est bien importé
import mongoose from "mongoose";



const addLeave = async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;
        const employee = await Employee.findOne({userId})

        const newLeave = new Leave({
            employeeId: employee._id, // Correction ici (suppression du "e" en trop)
            leaveType,
            startDate,
            endDate,
            reason,
        });

        await newLeave.save();
        return res.status(200).json({ success: true, message: "Leave request submitted successfully" });
    } catch (error) {
        console.error("Error adding leave request:", error);
        return res.status(500).json({ success: false, error: "Leave server error" });
    }
};





// const getLeave = async (req, res) => {
//     try {
//         const { id } = req.params;
//         let leaves = await Leave.find({employeeId: id })
//         if(!leaves){
//             const employee = await Employee.findOne({ userId: id });
//             const leaves = await Leave.find({ employeeId: employee._id });

//         }
//         return res.status(200).json({ success: true, leaves });
//     } catch (error) {
//         console.error("Erreur lors de la récupération des congés:", error);
//         return res.status(500).json({ success: false, error: "Erreur serveur" });
//     }
// };

const getLeave = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch leaves based on the employee's ID
        let leaves = await Leave.find({ employeeId: id });

        // If no leaves are found, fetch employee's ID and retrieve their leaves
        if (!leaves || leaves.length === 0) {
            const employee = await Employee.findOne({ userId: id });
            if (employee) {
                leaves = await Leave.find({ employeeId: employee._id });
            }
        }

        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.error("Error fetching leaves:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};







const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        });

        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.error("Error fetching leaves:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};


const getLeaveDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: "ID invalide" });
        }

        const leave = await Leave.findById(id).populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        });

        if (!leave) {
            return res.status(404).json({ success: false, error: "Congé non trouvé" });
        }

        return res.status(200).json({ success: true, leave });
    } catch (error) {
        console.error("Erreur lors de la récupération du congé:", error);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
};


const updateLeave = async (req, res) => {
    try {
        const {id}= req.params;
        const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status })
        if(!leave) {
            return res.status(404).json({ success: false, error: "leave not found" })
        }
        return res.status(200).json({success: true})
    } catch (error) {
        console.error("Erreur lors de la récupération du congé:", error);
        return res.status(500).json({ success: false, error: " leave update Erreur serveur" })
        
    }

}


export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };

