
import Department from "../models/Department.js";
import Employee from "../models/Employee.js"
import User from "../models/User.js"; 
import bcrypt from 'bcrypt'





const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            password,
            role,
            recruitmentDate,  // Cette ligne correspond à la nouvelle valeur
        } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "User already registered." });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
        });

        const savedUser = await newUser.save();

        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            recruitmentDate,  // Sauvegarder la date de recrutement dans la base
        });

        await newEmployee.save();

        return res.status(200).json({ success: true, message: "Employee created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error in adding employee" });
    }
};


const getEmployees = async (req, res) => {
    try {
        const employee = await Employee.find()
            .populate("userId", { password: 0 })
            .populate("department");

        return res.status(200).json({ success: true, employee });
    } catch (error) {
        console.error("Database query failed:", error);  // 🔴 Ajout pour voir l'erreur en détail
        return res.status(500).json({ success: false, error: error.message });
    }
};


const getEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        let employee; 
        employee = await Employee.findById(id)
            .populate("userId", { password: 0 })
            .populate("department");

        if (!employee) {
            //return res.status(404).json({ success: false, error: "Employee not found" });
            employee = await Employee.findOne({userId: id})
            .populate("userId", { password: 0 })
            .populate("department");

        }

        return res.status(200).json({ success: true, employee });
    } catch (error) {
        console.error("Database query failed:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};



const updateEmployee = async (req, res ) =>{
    try {
       const {id} = req.params;
       const {
        name,
        maritalStatus,
        designation,
        department,
        salary,
        recruitmentDate,  // Cette ligne correspond à la nouvelle valeur
    } = req.body;

    const employee = await Employee.findById({_id: id})
    if(!employee) {
        return res
        .status(404)
        .json({ success: false, error: "employee not found " });

    }
    const user = await User.findById({_id: employee.userId})
    if(!user) {
        return res
        .status(404)
        .json({ success: false, error: "user not found " });

    }
    const updateUser = await User.findByIdAndUpdate({_id: employee.userId}, {name})
    const updateEmployee = await Employee.findByIdAndUpdate({_id: id}, {
        maritalStatus,
        designation,
        department,
        salary,
        recruitmentDate

    }
    
)

    if(!updateEmployee || !updateUser){
        return res
        .status(404)
        .json({ success: false, error: "document  not found " });

    }
    return res.status(200).json({success: true, message:"employee update"})


    } catch (error) {
        return res.status(500).json({ success: false, error: "update employees server eerror " });

    }
    
}

const fetchEmployeesByDepId = async (req, res) => {
    const { id } = req.params;
    try {
        const employees = await Employee.find({department: id})

        return res.status(200).json({ success: true, employees });
    } catch (error) {
        return res.status(500).json({ success: false, error:"get employeesbyDepId server error" });
    }
}


export {addEmployee, getEmployees, getEmployee,updateEmployee, fetchEmployeesByDepId}
