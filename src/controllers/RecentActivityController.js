import RecentActivity from "../models/RecentActivity.js";

export const getRecentActivities = async (req, res) => {
    const userId = req._id;

    try {
        const recentActivities = await RecentActivity.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({recentActivities});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro ao obter atividades recentes.', error });
    }
}
