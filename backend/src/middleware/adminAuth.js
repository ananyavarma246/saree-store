const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Admin credentials from environment variables
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || 'admin@alankree.com',
    password: process.env.ADMIN_PASSWORD_HASH || '$2b$12$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW' // "admin123" - corrected hash
};

// Middleware to verify admin JWT token
const verifyAdminToken = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No admin token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET, {
            issuer: 'alankree-admin',
            audience: 'alankree-system'
        });
        
        // Verify it's an admin token
        if (!decoded.isAdmin || decoded.email !== ADMIN_CREDENTIALS.email) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid admin token.'
        });
    }
};

// Middleware for optional admin auth (for public admin endpoints)
const optionalAdminAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            if (decoded.isAdmin && decoded.email === ADMIN_CREDENTIALS.email) {
                req.admin = decoded;
            }
        }
        next();
    } catch (error) {
        // Continue without admin auth if token is invalid
        next();
    }
};

// Function to generate admin JWT token
const generateAdminToken = (adminData) => {
    return jwt.sign(
        {
            email: adminData.email,
            isAdmin: true,
            role: 'admin',
            loginTime: new Date().toISOString()
        },
        process.env.ADMIN_JWT_SECRET,
        { 
            expiresIn: '24h',
            issuer: 'alankree-admin',
            audience: 'alankree-system'
        }
    );
};

// Function to verify admin credentials
const verifyAdminCredentials = async (email, password) => {
    try {
        if (email !== ADMIN_CREDENTIALS.email) {
            return { success: false, message: 'Invalid admin credentials' };
        }

        const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid admin credentials' };
        }

        const token = generateAdminToken({ email });
        
        return {
            success: true,
            token,
            admin: {
                email,
                role: 'admin',
                isAdmin: true,
                loginTime: new Date().toISOString()
            }
        };
    } catch (error) {
        return { 
            success: false, 
            message: 'Authentication error',
            error: error.message 
        };
    }
};

// Rate limiting for admin endpoints
const adminRateLimit = {};
const ADMIN_RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

const adminRateLimiter = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!adminRateLimit[clientIP]) {
        adminRateLimit[clientIP] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    } else {
        if (now > adminRateLimit[clientIP].resetTime) {
            adminRateLimit[clientIP] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
        } else {
            adminRateLimit[clientIP].count++;
            if (adminRateLimit[clientIP].count > ADMIN_RATE_LIMIT) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many admin requests. Please try again later.'
                });
            }
        }
    }
    
    next();
};

module.exports = {
    verifyAdminToken,
    optionalAdminAuth,
    generateAdminToken,
    verifyAdminCredentials,
    adminRateLimiter,
    ADMIN_CREDENTIALS
};
