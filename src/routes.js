import { Router } from "express";
import dotenv from 'dotenv'
import { createUser, deleteUser, getUsers, loginUser, privateGetUser, refreshToken } from "./controllers/UserController.js";
import { createMember, deleteMember, getMember, getMembers, updateMember } from "./controllers/MemberController.js";
import { checkToken } from "./middlewares/auth.js";
import { storage } from "./config/multer.js";
import multer from "multer";
import { createTransaction, deleteTransaction, getTransaction,getAllTransactions, getTransactions, updateTransaction, getTransactionsByMonth, getTransactionsByYear } from "./controllers/TransactionController.js";
import { createCampaign, deleteCampaign, getCampaign, getCampaigns, updateCampaign } from "./controllers/CampaignController.js";
import { getRecentActivities } from "./controllers/RecentActivityController.js";

dotenv.config()
const upload = multer({ storage: storage }).array("files", 1);  // "files" é o nome do campo de arquivo no seu formulário
const routes = Router()

//User Routes
routes.get('/', getUsers)
routes.delete('/user/:id', checkToken, deleteUser)
routes.post('/auth/register/', createUser)
routes.post('/auth/login/', loginUser)
routes.get('/user/:id/', checkToken, privateGetUser)
routes.post('/auth/refresh-token', checkToken, refreshToken)

//Members Routes
routes.get('/members', checkToken, getMembers)
routes.get('/member/:id', checkToken, getMember)
routes.post('/member', upload, checkToken, createMember)
routes.delete('/member/:id', checkToken, deleteMember)
routes.put('/member/:id', checkToken, updateMember)

//Transactions Routes
routes.get('/transactions/', checkToken, getTransactions)
routes.get('/AllTransactions/', checkToken, getAllTransactions)
routes.get('/transaction/:id', checkToken, getTransaction)
routes.post('/transaction', checkToken, createTransaction)
routes.delete('/transaction/:id', checkToken, deleteTransaction)
routes.put('/transaction/:id', checkToken, updateTransaction)
routes.get('/transactions/:month', checkToken, getTransactionsByMonth);
routes.get('/transactions/year/:year', checkToken, getTransactionsByYear)

//Campaigns Routes
routes.get('/campaigns/', checkToken, getCampaigns)
routes.get('/campaign/:id', checkToken, getCampaign)
routes.post('/campaign', checkToken, createCampaign)
routes.delete('/campaign/:id', checkToken, deleteCampaign)
routes.put('/campaign/:id', checkToken, updateCampaign)

routes.get('/recents', checkToken, getRecentActivities)

export default routes