-- ============================================================================
-- DỰ ÁN TIỆM LỬA LUXURY - DỰNG KHO DỮ LIỆU CHUẨN SUPABASE (POSTGRESQL)
-- Hướng dẫn: Mở Supabase Dashboard -> chọn project -> SQL Editor -> dán & bấm RUN
-- ============================================================================

-- 1. TẠO BẢNG DANH MỤC SẢN PHẨM (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TẠO BẢNG SẢN PHẨM (products)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL,
    price_formatted VARCHAR(50) NOT NULL,
    badge VARCHAR(50),
    image_url TEXT NOT NULL,
    description TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TẠO BẢNG ĐƠN HÀNG (orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank',
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TẠO BẢNG CHI TIẾT ĐƠN HÀNG (order_items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- ============================================================================
-- BẬT PHÂN QUYỀN BẢO MẬT ROW LEVEL SECURITY (RLS) & POLICY TRUY CẬP
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người xem danh mục & sản phẩm công khai, admin quản lý full
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products full access" ON public.products;
CREATE POLICY "Public products full access" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Cho phép khách hàng gửi đơn hàng & Admin quản lý đơn hàng
DROP POLICY IF EXISTS "Public orders full access" ON public.orders;
CREATE POLICY "Public orders full access" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert order_items" ON public.order_items;
CREATE POLICY "Public insert order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);


-- ============================================================================
-- NẠP DỮ LIỆU BAN ĐẦU (SEED DATA): DANH MỤC
-- ============================================================================
INSERT INTO public.categories (id, name, slug, description) VALUES
('st-dupont', 'S.T. Dupont France', 'st-dupont', 'Thương hiệu bật lửa cao cấp lâu đời nhập khẩu chính hãng Pháp'),
('dupont-hk', 'Dupont Hongkong', 'dupont-hongkong', 'Phiên bản chế tác cao cấp chuẩn phom Ligne 2 & âm thanh Pinh'),
('rowenta', 'Rowenta R10', 'rowenta', 'Dòng bật lửa vintage cơ chế gạt đòn bẩy độc bản từ CHLB Đức'),
('phu-kien', 'Phụ Kiện Lửa', 'phu-kien', 'Bình gas nạp 5X pure, đá lửa chuyên dụng & bao da thủ công')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;


-- ============================================================================
-- NẠP DỮ LIỆU BAN ĐẦU (SEED DATA): TOÀN BỘ 18 SẢN PHẨM TIỆM LỬA
-- ============================================================================
INSERT INTO public.products (id, name, category_id, price, price_formatted, badge, image_url, description, specs) VALUES
(
    'st-cohiba-60',
    'Bật Lửa S.T. Dupont Cohiba 60th Anniversary Black Lacquer',
    'st-dupont',
    29000000,
    '29,000,000đ',
    'Bán Chạy',
    '/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp',
    'Tuyệt tác kỷ niệm 60 năm thương hiệu Cohiba kết hợp cùng S.T. Dupont Pháp. Thiết kế phủ sơn mài đen bóng cao cấp (Urushi lacquer), họa tiết logo đầu người Cohiba mạ vàng 24K thủ công tinh xảo. Tiếng mở nắp ''Pinh'' trong trẻo đặc trưng khẳng định vị thế quý ông thượng lưu.',
    '{"brand": "S.T. Dupont (Chính hãng Pháp)", "model": "Ligne 2 Cohiba 60th Edition", "material": "Đồng thau nguyên khối, Sơn mài tự nhiên & Mạ vàng 24K", "sound": "Tiếng ''Pinh'' vang, ngân dài chuẩn nốt", "fuel": "Bình Gas màng kim vàng Dupont chuyên dụng", "origin": "Paris, France", "warranty": "Bảo hành trọn đời & Căn chỉnh âm miễn phí"}'::jsonb
),
(
    'st-guilloche-gold',
    'Bật Lửa S.T. Dupont Ligne 2 Guilloche Mạ Vàng 24K',
    'st-dupont',
    18500000,
    '18,500,000đ',
    'Mới',
    '/assets/img/products/S.T Dupont/Micro Diamond head lighter.webp',
    'Dòng Ligne 2 với họa tiết hoa văn chạm khắc Guilloche kim cương mạ vàng 24K dày dặn. Thiết kế cổ điển mang biểu tượng của giới tinh hoa nước Pháp, khả năng giữ ga tuyệt vời và tiếng đánh lửa giòn giã.',
    '{"brand": "S.T. Dupont France", "model": "Ligne 2 Guilloche Classic Gold", "material": "Đồng thau mạ vàng 24K nguyên khối", "sound": "Tiếng Pinh đanh & vang xa", "fuel": "Gas Dupont vàng", "origin": "Pháp", "warranty": "Bảo hành trọn đời"}'::jsonb
),
(
    'st-opus-x',
    'Bật Lửa S.T. Dupont Fuente Opus X Limited Edition',
    'st-dupont',
    35000000,
    '35,000,000đ',
    'Giới Hạn',
    '/assets/img/products/S.T Dupont/Lacquered lighter fuente.webp',
    'Phiên bản giới hạn kết hợp cùng xì gà huyền thoại Fuente Opus X. Thân bật lửa phủ sơn mài đỏ - đen quyến rũ, họa tiết logo Opus X bằng vàng 18K đúc nổi sang trọng.',
    '{"brand": "S.T. Dupont Paris", "model": "Fuente Opus X Limited", "material": "Sơn mài Urushi & Vàng 18K", "sound": "Tiếng âm Pinh chuẩn nốt tuyệt đối", "fuel": "Gas màng kim Dupont", "origin": "Pháp", "warranty": "Bảo hành trọn đời & Đổi mới 30 ngày"}'::jsonb
),
(
    'st-diamond-head',
    'Bật Lửa S.T. Dupont Micro Diamond Head Silver Accent',
    'st-dupont',
    22000000,
    '22,000,000đ',
    'Hot',
    '/assets/img/products/S.T Dupont/Guilloche Lighter.webp',
    'Dòng họa tiết kim cương siêu nhỏ chạm khắc tinh vi bề mặt mạ Palladium/Bạc cao cấp. Ánh kim phản chiếu lấp lánh dưới mọi góc nhìn, phong cách thanh lịch dành cho quý ông hiện đại.',
    '{"brand": "S.T. Dupont France", "model": "Micro Diamond Head Silver", "material": "Đồng mạ Palladium cao cấp", "sound": "Tiếng vang trong trẻo", "fuel": "Gas Dupont chuẩn", "origin": "Pháp", "warranty": "Bảo hành trọn đời"}'::jsonb
),
(
    'st-lacquered-silver',
    'Bật Lửa S.T. Dupont Lacquered Silver Edition',
    'st-dupont',
    24000000,
    '24,000,000đ',
    'Cao Cấp',
    '/assets/img/products/S.T Dupont/Lacquered lighter Silver.webp',
    'Sự kết hợp tinh tế giữa sơn mài đen mịn màng cùng viền mạ bạc sáng bóng. Mang vẻ đẹp tối giản nhưng cực kỳ sang trọng và quý phái.',
    '{"brand": "S.T. Dupont Paris", "model": "Lacquered Silver Special", "material": "Sơn mài thủ công & Bạc mạ cao cấp", "sound": "Tiếng Pinh chuẩn Pháp", "fuel": "Gas Dupont vàng", "origin": "Pháp", "warranty": "Bảo hành trọn đời"}'::jsonb
),
(
    'hk-bac-xuoc-gold',
    'Dupont Hongkong Bạc Xước Viền Vàng Chuẩn Âm Thanh',
    'dupont-hk',
    2800000,
    '2,800,000đ',
    'Ưu Đãi',
    '/assets/img/products/Dupont HongKong/Bạc xước viền vàng.webp',
    'Phiên bản Dupont Hồng Kông chế tác vỏ đồng phay xước chống vân tay kết hợp đường viền mạ vàng lịch lãm. Chuẩn form dáng Ligne 2, ruột máy bền bỉ, âm thanh Pinh vang 8/10 so với bản Pháp.',
    '{"brand": "Dupont HongKong Chế Tác", "model": "Ligne 2 Bạc Xước Viền Vàng", "material": "Đồng thau phay xước & Viền mạ vàng", "sound": "Tiếng Pinh vang giòn", "fuel": "Gas butane nạp thông dụng", "origin": "Hongkong Premium Custom", "warranty": "Bảo hành 24 tháng"}'::jsonb
),
(
    'hk-son-mai-den',
    'Dupont Hongkong Sơn Mài Đen Viền Vàng Hoàng Gia',
    'dupont-hk',
    3200000,
    '3,200,000đ',
    'Bán Chạy',
    '/assets/img/products/Dupont HongKong/sơn mài đen viền vàng.webp',
    'Mẫu Dupont sơn mài đen viền vàng hoàng gia cực kỳ cuốn hút. Mặt sơn bóng bẩy kết hợp bánh xe đánh lửa nhạy bén, ngọn lửa mạnh mẽ chống gió tốt.',
    '{"brand": "Dupont Hongkong", "model": "Sơn Mài Đen Viền Vàng", "material": "Đồng thau phủ sơn bóng & Mạ vàng", "sound": "Tiếng Pinh thanh thoát", "fuel": "Gas nạp tiện lợi", "origin": "Hongkong", "warranty": "Bảo hành 24 tháng"}'::jsonb
),
(
    'hk-kim-cuong-gold',
    'Dupont Hongkong Hoạ Tiết Kim Cương Vàng Mạ 18K',
    'dupont-hk',
    3500000,
    '3,500,000đ',
    'Sang Trọng',
    '/assets/img/products/Dupont HongKong/Kim cương vàng.webp',
    'Hoạ tiết vân kim cương nổi 3D mạ vàng 18K tạo cảm giác cầm nắm chắc chắn và bắt mắt. Kiểu dáng đẳng cấp quý ông với mức giá cực kỳ dễ tiếp cận.',
    '{"brand": "Dupont Hongkong", "model": "Vân Kim Cương Vàng 18K", "material": "Đồng thau mạ vàng 18K", "sound": "Tiếng Pinh hay, ngân vang", "fuel": "Gas thông dụng", "origin": "Hongkong", "warranty": "Bảo hành 24 tháng"}'::jsonb
),
(
    'hk-vang-xuoc',
    'Dupont Hongkong Vàng Xước Cao Cấp Chuẩn Vỏ',
    'dupont-hk',
    2900000,
    '2,900,000đ',
    'Cao Cấp',
    '/assets/img/products/Dupont HongKong/vàng xước.webp',
    'Phiên bản xước sợi mì vàng sang trọng, không lo trầy xước hay bám dấu vân tay. Âm thanh mở nắp ngân thanh, giữ ga tốt trong thời gian dài.',
    '{"brand": "Dupont Hongkong", "model": "Vàng Phay Xước Premium", "material": "Đồng thau xước mạ vàng", "sound": "Tiếng Pinh đanh", "fuel": "Gas nạp", "origin": "Hongkong", "warranty": "Bảo hành 24 tháng"}'::jsonb
),
(
    'hk-vang-soc',
    'Dupont Hongkong Vàng Sọc Hoàng Gia Classic',
    'dupont-hk',
    2500000,
    '2,500,000đ',
    'Classic',
    '/assets/img/products/Dupont HongKong/Vàng sọc.jpg',
    'Họa tiết vạch sọc sọc dọc cổ điển mạ vàng óng ánh. Kiểu dáng chuẩn mực lịch lãm cho các tay chơi bật lửa yêu thích sự thanh lịch.',
    '{"brand": "Dupont Hongkong", "model": "Vàng Sọc Dọc Classic", "material": "Đồng thau mạ vàng", "sound": "Tiếng Pinh trong", "fuel": "Gas nạp thông thường", "origin": "Hongkong", "warranty": "Bảo hành 24 tháng"}'::jsonb
),
(
    'hk-den-xuoc',
    'Dupont Hongkong Đen Xước Sang Trọng Ligne 2',
    'dupont-hk',
    2700000,
    '2,700,000đ',
    'Độc Đáo',
    '/assets/img/products/Dupont HongKong/đen xước.webp',
    'Phủ tone màu đen phay xước cá tính và bí ẩn. Thiết kế chống trơn trượt, nhạy lửa ngay lần quẹt đầu tiên.',
    '{"brand": "Dupont Hongkong", "model": "Đen Xước Ligne 2", "material": "Đồng mạ đen phay xước", "sound": "Tiếng Pinh vang", "fuel": "Gas nạp", "origin": "Hongkong", "warranty": "Bảo hành 24 tháng"}'::jsonb
),
(
    'rowenta-kim-cuong-gold',
    'Bật Lửa Rowenta R10 Hoạ Tiết Kim Cương Vàng Vintage',
    'rowenta',
    4500000,
    '4,500,000đ',
    'Cổ Điển',
    '/assets/img/products/Rowenta R10/Kim cương vàng.webp',
    'Thương hiệu bật lửa lâu đời danh tiếng từ Đức - Rowenta R10. Thiết kế nắp đậy nằm ngang cơ chế dòn bẩy độc đáo, vân kim cương mạ vàng cổ điển mang hơi thở thập niên 70.',
    '{"brand": "Rowenta (Đức)", "model": "R10 Vintage Diamond Gold", "material": "Đồng thau mạ vàng vintage", "sound": "Cơ chế bật nắp cơ học độc đáo", "fuel": "Gas Rowenta / Gas Dupont", "origin": "Made in Germany", "warranty": "Bảo hành trọn đời cổ vật"}'::jsonb
),
(
    'rowenta-dung-nham',
    'Bật Lửa Rowenta R10 Hoạ Tiết Dung Nham Mạ Vàng Độc Bản',
    'rowenta',
    5900000,
    '5,900,000đ',
    'Độc Bản',
    '/assets/img/products/Rowenta R10/dung nham.webp',
    'Tuyệt tác chế tác với bề mặt tạo hiệu ứng vảy dung nham tự nhiên mạ vàng 24K cực hiếm. Sản phẩm sưu tầm độc bản giá trị tăng theo thời gian.',
    '{"brand": "Rowenta Germany", "model": "R10 Lava Gold Custom", "material": "Đồng chế tác vân dung nham mạ vàng 24K", "sound": "Âm nẩy cơ học sắc nét", "fuel": "Gas chuyên dụng", "origin": "Đức", "warranty": "Bảo hành trọn đời"}'::jsonb
),
(
    'rowenta-vang-xuoc',
    'Bật Lửa Rowenta R10 Vàng Xước Cổ Điển Đức',
    'rowenta',
    4200000,
    '4,200,000đ',
    'Sưu Tầm',
    '/assets/img/products/Rowenta R10/Vàng xước.jpg',
    'Dòng Rowenta R10 vàng phay xước nguyên bản nước Đức. Thích hợp làm quà tặng cao cấp hoặc bổ sung vào bộ sưu tập bật lửa quý hiếm.',
    '{"brand": "Rowenta Germany", "model": "R10 Gold Brushed Classic", "material": "Đồng thau phay xước mạ vàng", "sound": "Cơ chế nắp gạt êm ái", "fuel": "Gas nạp", "origin": "Đức", "warranty": "Bảo hành 36 tháng"}'::jsonb
),
(
    'rowenta-x-gold',
    'Bật Lửa Rowenta R10 X Vàng Chế Tác Thủ Công',
    'rowenta',
    5100000,
    '5,100,000đ',
    'Thủ Công',
    '/assets/img/products/Rowenta R10/X vàng.webp',
    'Chữ X đan xen tinh xảo trên nền mạ vàng sáng bóng. Từng đường nét được hoàn thiện thủ công mang vẻ đẹp tinh tế.',
    '{"brand": "Rowenta Germany", "model": "R10 Pattern X Gold", "material": "Đồng thau mạ vàng thủ công", "sound": "Tiếng bật cơ nẩy", "fuel": "Gas nạp", "origin": "Đức", "warranty": "Bảo hành trọn đời"}'::jsonb
),
(
    'rowenta-bac-xuoc',
    'Bật Lửa Rowenta R10 Bạc Xước Vintage Chân Thực',
    'rowenta',
    3900000,
    '3,900,000đ',
    'Vintage',
    '/assets/img/products/Rowenta R10/bạc xước.webp',
    'Phiên bản mạ bạc phay xước cổ điển, tạo cảm giác bụi bặm nhưng đầy uy lực của quý ông phong trần.',
    '{"brand": "Rowenta Germany", "model": "R10 Silver Brushed", "material": "Đồng mạ Bạc phay xước", "sound": "Cơ chế cơ học nẩy giòn", "fuel": "Gas nạp", "origin": "Đức", "warranty": "Bảo hành 36 tháng"}'::jsonb
),
(
    'pk-gas-150g',
    'Bình Gas Nạp Bật Lửa Dupont Chuyên Dụng 150g',
    'phu-kien',
    350000,
    '350,000đ',
    'Phụ Kiện',
    '/assets/img/products/Phụ kiện/Gas nạp 150g.webp',
    'Gas butane siêu tinh khiết lọc 5 lần chuyên dùng cho các dòng bật lửa S.T. Dupont, Dupont Hongkong và Rowenta R10. Giúp bảo vệ van ga, lửa cháy xanh mượt không mùi hôi và không làm đen đầu ngọn lửa.',
    '{"brand": "Dupont Official Accessories", "model": "Gas Butane Refill Can 150g", "material": "Khí Gas tinh khiết lọc 5 bước, kèm 5 đầu van thích ứng", "volume": "150g / 250ml", "origin": "Pháp / Châu Âu", "warranty": "Cam kết không tạp chất, bảo vệ van ga trọn đời"}'::jsonb
),
(
    'pk-da-lua',
    'Vỉ Đá Lửa Chuyên Dụng Cho Bật Lửa Dupont & Vintage',
    'phu-kien',
    150000,
    '150,000đ',
    'Phụ Kiện',
    '/assets/img/products/Phụ kiện/Đá lửa.webp',
    'Vỉ 8 viên đá lửa chuyên dụng có độ cứng vừa phải, độ nhạy tia lửa cao. Đảm bảo đánh lửa nhạy ngay lần quẹt đầu tiên mà không làm mòn bánh xe quẹt cao cấp.',
    '{"brand": "Dupont Accessories", "model": "Luxury Flint Card 8 Pcs", "material": "Hợp kim Magie - Xêri siêu nhạy tia lửa", "origin": "Pháp", "warranty": "Chính hãng 100%"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    price_formatted = EXCLUDED.price_formatted,
    badge = EXCLUDED.badge,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description,
    specs = EXCLUDED.specs;


-- ============================================================================
-- NẠP ĐƠN HÀNG MẪU DÙNG THỬ (MOCK ORDER)
-- ============================================================================
INSERT INTO public.orders (id, customer_name, customer_phone, customer_address, payment_method, total_amount, status, note) VALUES
(
    'TL-889921',
    'Lại Đại Vương',
    '0988883687',
    'Showroom Tiệm Lửa, Hớn Quản, Tây Bình Phước',
    'bank',
    29000000,
    'completed',
    'Giao hỏa tốc 2h kèm Hộp gỗ Velvet Luxury'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES
(
    'TL-889921',
    'st-cohiba-60',
    'Bật Lửa S.T. Dupont Cohiba 60th Anniversary Black Lacquer',
    1,
    29000000,
    29000000
)
ON CONFLICT DO NOTHING;
