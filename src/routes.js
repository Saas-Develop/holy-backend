import { Router } from "express";
import dotenv from 'dotenv'
import { createUser, deleteUser, getUsers, loginUser, privateGetUser, refreshToken, updateUser } from "./controllers/UserController.js";
import { createMember, deleteMember, getMember, getMembers, updateMember } from "./controllers/MemberController.js";
import { checkToken } from "./middlewares/auth.js";
import { storage } from "./config/multer.js";
import multer from "multer";
import upload from "./config/multer.js";
import { createTransaction, deleteTransaction, getTransaction,getAllTransactions, getTransactions, updateTransaction, getTransactionsByMonth, getTransactionsByYear, getTransactionsByYearAndMonth } from "./controllers/TransactionController.js";
import { createCampaign, deleteCampaign, getCampaign, getCampaigns, updateCampaign } from "./controllers/CampaignController.js";
import { getRecentActivities } from "./controllers/RecentActivityController.js";
import { createCheckout, createCustomerPortalSession } from "./controllers/PaymentController.js";
import { listenStripeWebhook } from "./services/StripeService.js";
import { createAdminUser, deleteAdminUser, getAdminUser, getAdminUsers, loginAdminUser, updateUserSubscription } from "./controllers/AdminUserController.js";

dotenv.config()
const routes = Router()

//User Routes
routes.get('/', getUsers)
routes.delete('/user/delete/:id', checkToken, deleteUser)
routes.post('/auth/register/', createUser)
routes.post('/auth/login/', loginUser)
routes.get('/user/:id/', checkToken, privateGetUser)
routes.patch('/user/:id', checkToken, updateUser)
routes.post('/auth/refresh-token', checkToken, refreshToken)

//Members Routes
routes.get('/members', checkToken, getMembers)
routes.get('/member/:id', checkToken, getMember)
routes.post('/member', upload.single("files"), checkToken, createMember)
routes.delete('/member/:id', checkToken, deleteMember)
routes.patch('/member/:id', upload.single("files"), checkToken, updateMember)

//Transactions Routes
routes.get('/transactions/', checkToken, getTransactions)
routes.get('/AllTransactions/', checkToken, getAllTransactions)
routes.get('/transaction/:id', checkToken, getTransaction)
routes.post('/transaction', checkToken, createTransaction)
routes.delete('/transaction/:id', checkToken, deleteTransaction)
routes.put('/transaction/:id', checkToken, updateTransaction)
routes.get('/transactions/:month', checkToken, getTransactionsByMonth)
routes.get('/transactions/year/:year', checkToken, getTransactionsByYear)
routes.get('/transactions/:year/:month', checkToken, getTransactionsByYearAndMonth)

//Campaigns Routes
routes.get('/campaigns/', checkToken, getCampaigns)
routes.get('/campaign/:id', checkToken, getCampaign)
routes.post('/campaign', checkToken, createCampaign)
routes.delete('/campaign/:id', checkToken, deleteCampaign)
routes.put('/campaign/:id', checkToken, updateCampaign)

routes.get('/recents', checkToken, getRecentActivities)

//Admin Routes
routes.get('/admin/users', getAdminUsers)
routes.post('/admin/register', createAdminUser)
routes.post('/admin/login', loginAdminUser)
routes.get('/admin/:id', checkToken, getAdminUser)
routes.delete('/admin/delete/:id', checkToken, deleteAdminUser)
routes.put('/admin/subscription/:id', checkToken, updateUserSubscription)

//Checkout Routes
routes.post('/create-checkout/:id', createCheckout)
routes.post('/create-customer-portal-session/:id', createCustomerPortalSession)

//WebHoook Stripe
routes.post('/webhook', listenStripeWebhook) 

export default routes