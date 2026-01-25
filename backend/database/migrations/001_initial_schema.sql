-- ============================================================================
-- LOYALTY PROGRAM v3.0 - DATABASE SCHEMA (Production-Ready)
-- ============================================================================
-- All 23 tables with proper indexing, constraints, and normalization
-- ============================================================================

-- ============================================================================
-- LAYER 1: IDENTITY & VERIFICATION
-- ============================================================================

-- 1. GUESTS - Global guest profiles (one per phone number)
CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    date_of_birth DATE,
    telegram_id VARCHAR(255) UNIQUE,
    source ENUM('telegram', 'web', 'qr', 'sms') NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    language VARCHAR(5) DEFAULT 'ru',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_phone (phone),
    INDEX idx_telegram_id (telegram_id),
    INDEX idx_is_verified (is_verified),
    INDEX idx_created_at (created_at)
);

-- 2. GUEST_CHILDREN - Children profiles for personalized marketing
CREATE TABLE IF NOT EXISTS guest_children (
    id VARCHAR(255) PRIMARY KEY,
    guest_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender ENUM('M', 'F', 'OTHER'),
    allergies TEXT,
    preferences JSON,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    INDEX idx_guest_id (guest_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_date_of_birth (date_of_birth)
);

-- 3. GUEST_RESTAURANTS - Guest registration in each restaurant network
CREATE TABLE IF NOT EXISTS guest_restaurants (
    id VARCHAR(255) PRIMARY KEY,
    guest_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    balance_points INT DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'BRONZE',
    tier_progression INT DEFAULT 0,
    visits_count INT DEFAULT 0,
    total_spent_rubles DECIMAL(12,2) DEFAULT 0,
    last_visit_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    block_reason VARCHAR(255),
    blocked_by VARCHAR(255),
    blocked_at TIMESTAMP,
    
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_guest_restaurant (guest_id, restaurant_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_tier (tier),
    INDEX idx_is_active (is_active),
    INDEX idx_last_visit_at (last_visit_at),
    INDEX idx_balance_points (balance_points)
);

-- 4. PHONE_VERIFICATION - SMS verification management
CREATE TABLE IF NOT EXISTS phone_verification (
    id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    used_for_guest_id VARCHAR(255),
    
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
);

-- 5. CARD_IDENTIFIERS - QR tokens and 6-digit codes
CREATE TABLE IF NOT EXISTS card_identifiers (
    id VARCHAR(255) PRIMARY KEY,
    guest_restaurant_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    qr_token VARCHAR(255) UNIQUE,
    six_digit_code VARCHAR(6),
    card_type ENUM('PHYSICAL', 'DIGITAL') DEFAULT 'DIGITAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    invalidated_by_tx_id VARCHAR(255),
    invalidated_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_restaurant_id) REFERENCES guest_restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_qr_token (qr_token),
    UNIQUE KEY unique_six_digit_code (restaurant_id, six_digit_code),
    INDEX idx_guest_restaurant_id (guest_restaurant_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- LAYER 2: TRANSACTIONS & POINTS
-- ============================================================================

-- 6. TRANSACTIONS - Complete audit log of all operations
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    guest_restaurant_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    guest_id VARCHAR(255) NOT NULL,
    transaction_type ENUM('SALE', 'REDEMPTION', 'MANUALCREDIT', 'MANUALDEBIT', 'TIERUPGRADE', 'EXPIRATION', 'REFERRALCREDIT') NOT NULL,
    amount_rubles DECIMAL(12,2),
    base_points_awarded INT DEFAULT 0,
    bonus_points_awarded INT DEFAULT 0,
    points_changed INT,
    old_balance INT,
    new_balance INT,
    old_tier VARCHAR(20),
    new_tier VARCHAR(20),
    discount_percent INT DEFAULT 0,
    cheque_number VARCHAR(50),
    pos_id VARCHAR(255),
    cashier_id VARCHAR(255),
    manager_id VARCHAR(255),
    manual_comment TEXT,
    status ENUM('COMPLETED', 'PENDING', 'FAILED', 'CANCELLED') DEFAULT 'COMPLETED',
    error_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_restaurant_id) REFERENCES guest_restaurants(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    INDEX idx_guest_id (guest_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status),
    INDEX idx_guest_restaurant_created (guest_restaurant_id, created_at)
);

-- 7. BALANCE_DETAIL - Points breakdown (for analytics)
CREATE TABLE IF NOT EXISTS balance_detail (
    id VARCHAR(255) PRIMARY KEY,
    guest_restaurant_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    base_points INT DEFAULT 0,
    bonus_points INT DEFAULT 0,
    transferred_points INT DEFAULT 0,
    expired_points INT DEFAULT 0,
    redeemed_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_restaurant_id) REFERENCES guest_restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_balance_detail (guest_restaurant_id),
    INDEX idx_restaurant_id (restaurant_id)
);

-- 8. TIER_EVENTS - Tier progression history
CREATE TABLE IF NOT EXISTS tier_events (
    id VARCHAR(255) PRIMARY KEY,
    guest_restaurant_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    old_tier VARCHAR(20),
    new_tier VARCHAR(20) NOT NULL,
    transaction_id VARCHAR(255),
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_restaurant_id) REFERENCES guest_restaurants(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_new_tier (new_tier),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- LAYER 3: BUSINESS & CUSTOMIZATION
-- ============================================================================

-- 9. RESTAURANTS - Restaurant network records
CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(255) PRIMARY KEY,
    owner_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(512),
    primary_color VARCHAR(7) DEFAULT '#000000',
    secondary_color VARCHAR(7) DEFAULT '#FFFFFF',
    system_type ENUM('DISCOUNT', 'ACCUMULATION') DEFAULT 'DISCOUNT',
    subscription_tier ENUM('FREE', 'CUSTOM', 'STANDARD', 'PRO', 'ULTIMA') DEFAULT 'STANDARD',
    subscription_expires_at TIMESTAMP,
    status ENUM('ACTIVE', 'FROZEN', 'BLOCKED') DEFAULT 'ACTIVE',
    guest_count INT DEFAULT 0,
    pos_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id),
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_subscription_tier (subscription_tier),
    INDEX idx_created_at (created_at)
);

-- 10. POINTS_OF_SALE - Individual restaurant locations
CREATE TABLE IF NOT EXISTS points_of_sale (
    id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    establishment_type VARCHAR(50),
    opening_hours JSON,
    capacity INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- 11. LOYALTY_CUSTOMIZATION - Global program settings per restaurant
CREATE TABLE IF NOT EXISTS loyalty_customization (
    id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL UNIQUE,
    min_purchase_amount DECIMAL(10,2) DEFAULT 100,
    points_expiration_days INT DEFAULT 90,
    bonus_calculation_formula VARCHAR(255),
    card_design_template VARCHAR(255),
    colors JSON,
    telegram_bot_enabled BOOLEAN DEFAULT true,
    sms_notifications_enabled BOOLEAN DEFAULT false,
    email_notifications_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_id (restaurant_id)
);

-- 12. TIER_DEFINITIONS - Customizable tier levels per restaurant
CREATE TABLE IF NOT EXISTS tier_definitions (
    id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    tier_level INT NOT NULL,
    min_points INT DEFAULT 0,
    max_points INT DEFAULT 0,
    discount_percent INT DEFAULT 0,
    tier_color VARCHAR(7),
    tier_icon VARCHAR(255),
    privileges JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tier_per_restaurant (restaurant_id, tier_level),
    INDEX idx_restaurant_id (restaurant_id)
);

-- 13. STAFF_RESTAURANTS - Manager-to-restaurant assignments
CREATE TABLE IF NOT EXISTS staff_restaurants (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    role ENUM('MANAGER', 'CASHIER') DEFAULT 'MANAGER',
    permissions JSON,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_restaurant (user_id, restaurant_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_user_id (user_id)
);

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- 14. USERS - All system users (OWNER, MANAGER, GUEST accounts)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role ENUM('OWNER', 'MANAGER', 'CASHIER', 'GUEST') DEFAULT 'GUEST',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- 15. SESSIONS - User session management
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- ============================================================================
-- MARKETING & PROMOTIONS
-- ============================================================================

-- 16. PROMOTIONS - Marketing campaigns
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    promotion_type ENUM('BONUS_POINTS', 'DISCOUNT', 'TIER_BOOST', 'REFERRAL', 'BIRTHDAY', 'SEASONAL') NOT NULL,
    bonus_points INT,
    discount_percent INT,
    conditions JSON,
    budget_cap DECIMAL(12,2),
    used_budget DECIMAL(12,2) DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_is_active (is_active),
    INDEX idx_start_date (start_date)
);

-- 17. PROMOTION_APPLICATIONS - Track which guests used which promotions
CREATE TABLE IF NOT EXISTS promotion_applications (
    id VARCHAR(255) PRIMARY KEY,
    promotion_id VARCHAR(255) NOT NULL,
    guest_id VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    INDEX idx_promotion_id (promotion_id),
    INDEX idx_guest_id (guest_id)
);

-- ============================================================================
-- REFERRALS
-- ============================================================================

-- 18. REFERRALS - Referral program tracking
CREATE TABLE IF NOT EXISTS referrals (
    id VARCHAR(255) PRIMARY KEY,
    referrer_guest_id VARCHAR(255) NOT NULL,
    referred_guest_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    referral_link VARCHAR(512),
    referrer_bonus_points INT DEFAULT 0,
    referred_bonus_points INT DEFAULT 0,
    referrer_bonus_awarded BOOLEAN DEFAULT false,
    referred_bonus_awarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (referrer_guest_id) REFERENCES guests(id),
    FOREIGN KEY (referred_guest_id) REFERENCES guests(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    UNIQUE KEY unique_referral (referrer_guest_id, referred_guest_id, restaurant_id),
    INDEX idx_referrer_guest_id (referrer_guest_id),
    INDEX idx_restaurant_id (restaurant_id)
);

-- ============================================================================
-- AUDIT & LOGGING
-- ============================================================================

-- 19. AUDIT_LOGS - Complete audit trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    restaurant_id VARCHAR(255),
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('SUCCESS', 'FAILED', 'PENDING') DEFAULT 'SUCCESS',
    error_info TEXT,
    execution_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_resource_type (resource_type)
);

-- ============================================================================
-- SUBSCRIPTIONS & BILLING
-- ============================================================================

-- 20. SUBSCRIPTIONS - Subscription management
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL UNIQUE,
    tier ENUM('FREE', 'CUSTOM', 'STANDARD', 'PRO', 'ULTIMA') DEFAULT 'STANDARD',
    monthly_price DECIMAL(10,2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT true,
    status ENUM('ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED') DEFAULT 'ACTIVE',
    payment_method VARCHAR(50),
    last_payment_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
);

-- 21. INVOICES - Billing records
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(255) PRIMARY KEY,
    subscription_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_status (status),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_due_date (due_date)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- 22. NOTIFICATIONS - Push notifications queue
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    guest_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    channel ENUM('TELEGRAM', 'SMS', 'EMAIL') NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    INDEX idx_guest_id (guest_id),
    INDEX idx_is_sent (is_sent),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- SETTINGS & CONFIGURATION
-- ============================================================================

-- 23. SYSTEM_SETTINGS - Global platform settings
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(255) PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value VARCHAR(1000),
    data_type VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_transactions_guest_restaurant_created ON transactions(guest_restaurant_id, created_at DESC);
CREATE INDEX idx_transactions_restaurant_created ON transactions(restaurant_id, created_at DESC);
CREATE INDEX idx_guest_restaurants_restaurant_tier ON guest_restaurants(restaurant_id, tier);
CREATE INDEX idx_card_identifiers_qr ON card_identifiers(qr_token, is_active);
CREATE INDEX idx_card_identifiers_six ON card_identifiers(restaurant_id, six_digit_code, is_active);

-- ============================================================================
-- SEED DATA (Optional - for initial setup)
-- ============================================================================

-- Insert default system settings
INSERT IGNORE INTO system_settings (id, setting_key, setting_value, data_type, is_public) VALUES
('set_1', 'points_expiration_days', '90', 'INT', false),
('set_2', 'sms_provider', 'twilio', 'STRING', false),
('set_3', 'max_promo_budget', '1000000', 'DECIMAL', false),
('set_4', 'tier_expiration_days', '180', 'INT', false);
