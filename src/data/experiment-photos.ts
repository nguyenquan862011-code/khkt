export interface ExperimentPhotoMeta {
  id: string;
  src: string;
  title: string;
  caption: string;
  sourceName: string;
  sourceUrl: string;
  author: string;
  license: string;
}

export const EXPERIMENT_PHOTOS: Record<string, ExperimentPhotoMeta> = {
  // === 8 Thí nghiệm nổi bật trên Trang chủ ===
  "circular-motion": {
    id: "circular-motion",
    src: "/images/experiments/circular-motion-wheel.jpg",
    title: "Chuyển động tròn đều qua ảnh phơi sáng vòng quay",
    caption:
      "Quỹ đạo tròn đồng tâm và chuyển động tiếp tuyến đều của các điểm nằm cách tâm quay những bán kính R khác nhau.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ferris_wheel_in_motion_01.jpg",
    author: "Rick Doble",
    license: "CC BY-SA 4.0",
  },
  "water-interference": {
    id: "water-interference",
    src: "/images/experiments/ripple-tank-interference.jpg",
    title: "Giao thoa sóng nước từ hai nguồn kết hợp trong bể sóng (Ripple Tank)",
    caption:
      "Ảnh thí nghiệm thực tế ghi lại các dãy cực đại sáng rõ và các đường cực tiểu xen kẽ hình hypebol trên mặt nước.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2_Source_Interference_as_observed_in_the_Ripple_Tank._Bright_Spots_Can_be_Distinctly_Seen.jpg",
    author: "Psgs123xyz",
    license: "CC0 (Public Domain)",
  },
  pendulum: {
    id: "pendulum",
    src: "/images/experiments/pendulum-strobe.jpg",
    title: "Ảnh chụp hoạt nghiệm chuyển động con lắc đơn & bảo toàn cơ năng",
    caption:
      "Quả cầu dao động đạt đúng độ cao ban đầu (đường nét đứt) bất chấp chốt chặn đổi chiều dài dây.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Blocked-pendulum-strobe.jpg",
    author: "MikeRun",
    license: "CC BY-SA 4.0",
  },
  projectile: {
    id: "projectile",
    src: "/images/experiments/projectile-water-jet.jpg",
    title: "Quỹ đạo parabol của tia nước ném xiên trong trọng trường",
    caption:
      "Các tia nước phun dưới những góc nghiêng khác nhau vẽ nên các nhánh parabol đối xứng qua đỉnh quỹ đạo.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ParabolicWaterTrajectory.jpg",
    author: "GuidoB",
    license: "CC BY-SA 3.0",
  },
  newton: {
    id: "newton",
    src: "/images/experiments/newton-airtrack.jpg",
    title: "Đệm khí tuyến tính & cổng quang điện kiểm chứng Định luật II Newton",
    caption:
      "Xe trượt chuyển động hầu như không ma sát trên đệm khí để đo gia tốc a theo lực kéo F và khối lượng m.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Airtrack.JPG",
    author: "Bhavesh.Chauhan",
    license: "CC BY-SA 3.0",
  },
  "standing-wave": {
    id: "standing-wave",
    src: "/images/experiments/standing-wave-string.jpg",
    title: "Bụng sóng và nút sóng dừng phát sáng trên dây dao động",
    caption:
      "Hình ảnh thực nghiệm các bó sóng dừng rõ nét với các nút đứng yên và bụng sóng dao động biên độ cực đại.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Stehende_Welle.JPG",
    author: "Roadbrothers",
    license: "CC BY-SA 4.0",
  },
  lorentz: {
    id: "lorentz",
    src: "/images/experiments/lorentz-electron-beam.jpg",
    title: "Quỹ đạo tròn của chùm hạt mang điện trong từ trường đều (Lực Lorentz)",
    caption:
      "Chùm electron phát sáng bị lực từ uốn cong thành quỹ đạo tròn trong ống thủy tinh chân không chứa khí loãng.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cyclotron_motion_smaller_view.jpg",
    author: "Sfu",
    license: "CC BY-SA 3.0",
  },
  "ripple-diffraction": {
    id: "ripple-diffraction",
    src: "/images/experiments/ripple-tank-diffraction.jpg",
    title: "Truyền sóng và nhiễu xạ trên mặt nước trong bể gợn sóng",
    caption: "Quan sát bước sóng ngắn trên mặt nước khi gặp vật cản trong bể thí nghiệm thực hành.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Obstacle-high-frequency-ripple-tank.jpg",
    author: "Wikimedia Contributor",
    license: "BSD",
  },

  // === 5 Lĩnh vực trong Phòng Lab Tương tác (InteractivePhysicsLab) ===
  "co-hoc": {
    id: "co-hoc",
    src: "/images/experiments/co-hoc-projectile-strobe.jpg",
    title: "Ảnh chụp hoạt nghiệm quỹ đạo parabol của quả bóng nảy",
    caption:
      "Chuỗi vị trí quả bóng cách đều theo thời gian cho thấy vận tốc ngang không đổi và gia tốc thẳng đứng g.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bouncing_ball_strobe_edit.jpg",
    author: "MichaelMaggs & Richard Bartz",
    license: "CC BY-SA 3.0",
  },
  "dao-dong-song": {
    id: "dao-dong-song",
    src: "/images/experiments/spring-scale-lab.jpg",
    title: "Lực kế lò xo thực nghiệm đo độ giãn và lực đàn hồi",
    caption:
      "Thiết bị lò xo chia độ Newton kiểm chứng tỉ lệ tuyến tính giữa lực hồi phục và độ biến dạng Δl.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:A_spring_scale.jpg",
    author: "Jeremyida002",
    license: "CC BY-SA 4.0",
  },
  "nhiet-hoc": {
    id: "nhiet-hoc",
    src: "/images/experiments/ideal-gas-syringe.jpg",
    title: "Xi-lanh thủy tinh chia độ khảo sát thể tích khối khí",
    caption:
      "Ống xi-lanh kín cho phép thay đổi và đọc trực tiếp thể tích khí trong các thí nghiệm chất khí.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Gas_syringe.jpg",
    author: "Geni",
    license: "CC BY-SA 3.0",
  },
  "dien-tu": {
    id: "dien-tu",
    src: "/images/experiments/ohm-dc-meter.jpg",
    title: "Đồng hồ đo dòng điện một chiều & điện lượng trong mạch",
    caption:
      "Thiết bị đo dòng điện phòng thí nghiệm cổ điển dùng theo dõi cường độ dòng chạy qua mạch kín.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:DC_Electric_Meter.JPG",
    author: "I B Wright",
    license: "CC BY-SA 3.0",
  },
  "quang-hoc": {
    id: "quang-hoc",
    src: "/images/experiments/thin-lens-image.jpg",
    title: "Ảnh thật ngược chiều qua thấu kính hội tụ thủy tinh",
    caption:
      "Khi vật nằm ngoài tiêu cự f, thấu kính hội tụ tạo ảnh thật ngược chiều có thể quan sát trực tiếp.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Convex_lens_flipped_image.JPG",
    author: "CoolKoon",
    license: "CC BY 3.0",
  },

  // === Thư viện Thí nghiệm Kinh điển (CE01 – CE42, trừ CE04 đang dùng fallback) ===
  "ce01-galilei-roi-tu-do": {
    id: "ce01-galilei-roi-tu-do",
    src: "/images/experiments/ce01-free-fall-tube.jpg",
    title: "Tháp ống thả rơi chân không nghiên cứu rơi tự do (NASA Zero-G)",
    caption:
      "Buồng thả thẳng đứng khử lực cản không khí giúp mọi vật rơi với cùng gia tốc trọng trường g.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ZeroGFacilityTube.jpg",
    author: "Ben_pcc",
    license: "Public domain",
  },
  "ce02-galilei-mat-nghieng": {
    id: "ce02-galilei-mat-nghieng",
    src: "/images/experiments/ce02-galileo-inclined-plane.jpg",
    title: "Mô hình phục dựng máng nghiêng gỗ thí nghiệm của Galilei",
    caption:
      "Máng nghiêng giúp làm chậm quá trình rơi tự do để đo chính xác quy luật quãng đường s tỉ lệ t².",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:GalileosInclinedPlane.jpg",
    author: "Jim & Rhoda Morris",
    license: "Attribution",
  },
  "ce03-con-lac-don-chu-ky": {
    id: "ce03-con-lac-don-chu-ky",
    src: "/images/experiments/ce03-pendulum-clock.jpg",
    title: "Đồng hồ con lắc chuẩn thiên văn ứng dụng tính đẳng thời",
    caption:
      "Quả lắc có chu kỳ ổn định T = 2π√(l/g) từng là bộ chuẩn đo thời gian chính xác nhất thế kỷ XIX.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Monumental_clock_by_Farcot,_1878.jpg",
    author: "E. Neurdein",
    license: "Public domain",
  },
  "ce05-dinh-luat-hooke": {
    id: "ce05-dinh-luat-hooke",
    src: "/images/experiments/ce05-hooke-dynamometer.jpg",
    title: "Thí nghiệm lực kế lò xo và quả cân kiểm chứng Định luật Hooke",
    caption: "Độ giãn lò xo tỉ lệ thuận với trọng lượng vật treo trong giới hạn đàn hồi F = k·Δl.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Photo_dynamometres_charges_original.jpg",
    author: "Cdang",
    license: "CC BY-SA 3.0",
  },
  "ce06-cavendish-hang-so-hap-dan": {
    id: "ce06-cavendish-hang-so-hap-dan",
    src: "/images/experiments/ce06-cavendish-balance.jpg",
    title: "Cân xoắn Cavendish hiện đại đo hằng số hấp dẫn G",
    caption:
      "Hệ thanh treo mảnh phản xạ tia sáng giúp đo lực hấp dẫn cực nhỏ giữa các quả cầu chì.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cavendish_experiment_2.jpg",
    author: "GOKLuLe",
    license: "CC BY-SA 3.0",
  },
  "ce07-newton-con-lac-va-cham": {
    id: "ce07-newton-con-lac-va-cham",
    src: "/images/experiments/ce07-newtons-cradle.jpg",
    title: "Con lắc va chạm đàn hồi Newton chứng minh bảo toàn động lượng",
    caption:
      "Động lượng và cơ năng được truyền gần như nguyên vẹn qua dãy bi thép từ đầu này sang đầu kia.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Newtons_Cradle.jpg",
    author: "The Dean of Physics",
    license: "CC BY-SA 4.0",
  },
  "ce08-joule-nhiet-tuong-duong": {
    id: "ce08-joule-nhiet-tuong-duong",
    src: "/images/experiments/ce08-joule-apparatus.jpg",
    title: "Thiết bị guồng quay nhiệt lượng kế gốc của James Prescott Joule",
    caption:
      "Hệ cánh khuấy đồng quay trong bình nước chứng minh công cơ học chuyển hóa định lượng thành nhiệt năng.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Joule_Apparatus.jpg",
    author: "Dr. Mirko Junge",
    license: "CC BY-SA 3.0",
  },
  "ce09-giao-thoa-khe-young": {
    id: "ce09-giao-thoa-khe-young",
    src: "/images/experiments/ce09-young-double-slit.jpg",
    title: "Hệ vân giao thoa ánh sáng qua hai khe hẹp Young bằng laser lục",
    caption: "Các vân sáng và vân tối cách đều nhau khẳng định bản chất sóng của ánh sáng.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Young%27s_slits.jpg",
    author: "Graham Beards",
    license: "CC BY-SA 4.0",
  },
  "ce10-song-dung-tren-day": {
    id: "ce10-song-dung-tren-day",
    src: "/images/experiments/ce10-melde-standing-wave.jpg",
    title: "Ảnh chụp dao động sóng dừng thực tế trên dây đàn cố định hai đầu",
    caption:
      "Hiệu ứng màn trập quét ghi lại biên dạng hình sin dọc theo các dây đang dao động cộng hưởng.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rolling_Shutter_Cello_Strings.jpg",
    author: "Ephramac",
    license: "CC BY-SA 4.0",
  },
  "ce11-foucault-con-lac-trai-dat": {
    id: "ce11-foucault-con-lac-trai-dat",
    src: "/images/experiments/ce11-foucault-pendulum.jpg",
    title: "Con lắc Foucault tại Điện Panthéon (Paris) chứng minh Trái Đất tự quay",
    caption:
      "Mặt phẳng dao động của quả cầu đồng xoay dần theo thời gian tương đối với sàn nhà đứng yên trên Trái Đất.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panth%C3%A9on_Pendule_de_Foucault2.JPG",
    author: "Rémih",
    license: "CC BY-SA 3.0",
  },
  "ce12-doppler-hieu-ung-song": {
    id: "ce12-doppler-hieu-ung-song",
    src: "/images/experiments/ce12-doppler-mach-wave.jpg",
    title: "Ảnh Schlieren ghi nhận sự dồn nén mặt sóng áp suất (NASA)",
    caption:
      "Nguồn chuyển động làm các mặt sóng nén chặt về phía trước — biểu hiện trực quan của hiệu ứng Doppler.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Schlierenfoto_Mach_1-2_Pfeilfl%C3%BCgel_-_NASA.jpg",
    author: "NASA",
    license: "Public domain",
  },
  "ce13-song-am-cong-huong-kundt": {
    id: "ce13-song-am-cong-huong-kundt",
    src: "/images/experiments/ce13-kundt-tube.jpg",
    title: "Bộ thí nghiệm ống cộng hưởng âm Kundt và máy phát tần số",
    caption:
      "Ống trụ âm học kết hợp máy phát âm đo bước sóng đứng trong không khí và xác định tốc độ truyền âm.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tubo_de_Kundt.jpg",
    author: "LFISETSITUPM2011",
    license: "CC BY-SA 3.0",
  },
  "ce14-boyle-mariotte-dang-nhiet": {
    id: "ce14-boyle-mariotte-dang-nhiet",
    src: "/images/experiments/ce14-boyle-manometer.jpg",
    title: "Áp kế cột thủy ngân đo áp suất khí theo độ cao cột chất lỏng",
    caption:
      "Độ chênh lệch mức thủy ngân cho biết trực tiếp áp suất khí trong quá trình nén đẳng nhiệt.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mercury_manometer.jpg",
    author: "Michael V Hayes",
    license: "CC BY-SA 3.0",
  },
  "ce15-coulomb-can-xoan-tinh-dien": {
    id: "ce15-coulomb-can-xoan-tinh-dien",
    src: "/images/experiments/ce15-electrostatic-generator.jpg",
    title: "Máy phát tĩnh điện Van de Graaff tạo điện tích điểm điện thế cao",
    caption:
      "Quả cầu kim loại tích điện mạnh phục vụ các thí nghiệm tương tác tĩnh điện và phóng điện không khí.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bendgenratoro-kun.JPG",
    author: "Walber",
    license: "CC BY-SA 4.0",
  },
  "ce16-dinh-luat-ohm": {
    id: "ce16-dinh-luat-ohm",
    src: "/images/experiments/ce16-ohm-multimeter.jpg",
    title: "Đồng hồ vạn năng kim chỉ thị đo điện trở, hiệu điện thế và cường độ dòng",
    caption:
      "Thiết bị đo các thông số U, I, R trực tiếp trong mạch điện để kiểm chứng hệ thức I = U / R.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:YX360TRF(Sanwa).JPG",
    author: "KZang",
    license: "CC BY-SA 3.0",
  },
  "ce17-oersted-dong-dien-tu-truong": {
    id: "ce17-oersted-dong-dien-tu-truong",
    src: "/images/experiments/ce17-oersted-compass.jpg",
    title: "Thí nghiệm Oersted thực tế: kim nam châm lệch khi đóng dòng điện",
    caption:
      "Dòng điện chạy qua dây dẫn thẳng tạo ra từ trường làm kim la bàn đặt bên dưới quay vuông góc với dây.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Oersted-switched-on-overlay.jpg",
    author: "MikeRun",
    license: "CC BY-SA 4.0",
  },
  "ce18-ampere-tuong-tac-hai-dong-dien": {
    id: "ce18-ampere-tuong-tac-hai-dong-dien",
    src: "/images/experiments/ce18-ampere-balance.jpg",
    title: "Cân dòng điện chuẩn Ampère đo lực tương tác từ giữa các cuộn dây",
    caption:
      "Dụng cụ đo chính xác lực điện từ giữa hai dòng điện chuẩn tại Viện Tiêu chuẩn Quốc gia (1927).",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ampere_balance_1927.jpg",
    author: "National Bureau of Standards",
    license: "Public domain",
  },
  "ce19-cam-ung-faraday": {
    id: "ce19-cam-ung-faraday",
    src: "/images/experiments/ce19-faraday-coil.jpg",
    title: "Cuộn dây cảm ứng điện từ nguyên bản của Michael Faraday",
    caption:
      "Hiện vật bảo tàng cuộn dây sơ cấp – lõi sắt của Faraday chứng minh từ thông biến thiên sinh ra suất điện động.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Faraday%27s_first_sparking_coil_Wellcome_M0002526.jpg",
    author: "Wellcome Collection",
    license: "CC BY 4.0",
  },
  "ce20-lenz-chieu-dong-cam-ung": {
    id: "ce20-lenz-chieu-dong-cam-ung",
    src: "/images/experiments/ce20-lenz-ring.jpg",
    title: "Thí nghiệm vòng nhảy & vòng treo cảm ứng minh họa Định luật Lenz",
    caption:
      "Vòng kim loại liền chịu lực đẩy từ trường biến thiên của ống dây, còn vòng hở mạch không bị đẩy.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Electrodynamic-suspension.jpg",
    author: "MikeRun",
    license: "CC BY-SA 4.0",
  },
  "ce21-thomson-e-tren-m": {
    id: "ce21-thomson-e-tren-m",
    src: "/images/experiments/ce21-thomson-teltron.jpg",
    title: "Ống tia điện tử Teltron đặt trong cặp cuộn dây Helmholtz",
    caption:
      "Đo độ lệch chùm tia âm cực trong điện trường và từ trường để xác định tỉ số e/m của electron.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Teltron-Diffraction-Tube-with-Helmholtz-Coils-and-Stand.jpg",
    author: "Thaddeus P. Bejnar",
    license: "Public domain",
  },
  "ce22-millikan-giot-dau-dien-tich": {
    id: "ce22-millikan-giot-dau-dien-tich",
    src: "/images/experiments/ce22-millikan-oil-drop.jpg",
    title: "Hệ thiết bị lịch sử thí nghiệm giọt dầu của Robert Millikan",
    caption:
      "Buồng tụ điện phẳng kết hợp kính hiển vi đo điện tích nguyên tố e của từng giọt dầu lơ lửng.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Millikan%27s_setup_for_the_oil_drop_experiment.jpg",
    author: "University of Chicago Archive",
    license: "Public domain",
  },
  "ce23-wheatstone-cau-do-dien-tro": {
    id: "ce23-wheatstone-cau-do-dien-tro",
    src: "/images/experiments/ce23-wheatstone-bridge.jpg",
    title: "Bộ mạch cầu Wheatstone thực hành xác định điện trở chính xác",
    caption:
      "Cấu trúc mạch cầu bốn nhánh điều chỉnh điểm cân bằng điện thế để tìm điện trở chưa biết.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:00114_Apparecchio_dimostrativo_di_ponte_Wheatstone.jpg",
    author: "Liceo Classico Annibal Caro",
    license: "CC BY 4.0",
  },
  "ce24-newton-tan-sac-lang-kinh": {
    id: "ce24-newton-tan-sac-lang-kinh",
    src: "/images/experiments/ce24-newton-prism.jpg",
    title: "Hiện tượng tán sắc ánh sáng qua lăng kính thủy tinh thực tế",
    caption:
      "Chùm sáng tới bị tách thành dải quang phổ liên tục từ đỏ đến tím do chiết suất phụ thuộc bước sóng.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Light_dispersion_of_a_mercury-vapor_lamp_with_a_flint_glass_prism_IPNr%C2%B00125.jpg",
    author: "D-Kuru",
    license: "CC BY-SA 3.0 AT",
  },
  "ce25-hieu-ung-quang-dien": {
    id: "ce25-hieu-ung-quang-dien",
    src: "/images/experiments/ce25-photoelectric-tubes.jpg",
    title: "Các tế bào quang điện chân không catốt kim loại kiềm",
    caption:
      "Ống thủy tinh chân không chứa catốt nhạy sáng giải phóng quang electron khi nhận photon đủ năng lượng.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Phototubes.jpg",
    author: "Grinevitski",
    license: "CC BY 3.0",
  },
  "ce26-rutherford-tan-xa-hat-alpha": {
    id: "ce26-rutherford-tan-xa-hat-alpha",
    src: "/images/experiments/ce26-rutherford-cloud-chamber.jpg",
    title: "Buồng sương Wilson tại Phòng thí nghiệm Cavendish (Cambridge)",
    caption:
      "Thiết bị ghi nhận vết quỹ đạo hạt alpha tán xạ và tương tác hạt nhân trong hơi bão hòa.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:CTRwilsonCloudChamberCavendishLab2013-08-29-17-09-40.jpg",
    author: "Rolf Kickuth",
    license: "CC BY-SA 4.0",
  },
  "ce27-quang-pho-vach-hydro-bohr": {
    id: "ce27-quang-pho-vach-hydro-bohr",
    src: "/images/experiments/ce27-hydrogen-balmer-lamp.jpg",
    title: "Ống phóng điện khí Hydro phát bức xạ đặc trưng dãy Balmer",
    caption:
      "Ánh sáng hồng đặc trưng từ nguyên tử Hydro khi electron chuyển giữa các mức năng lượng lượng tử hóa.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hydrogen_Lamp_(24856071897).jpg",
    author: "UCL Mathematical & Physical Sciences",
    license: "CC BY 2.0",
  },
  "ce28-malus-phan-cuc-anh-sang": {
    id: "ce28-malus-phan-cuc-anh-sang",
    src: "/images/experiments/ce28-malus-polarizer.jpg",
    title: "Khử ánh sáng phản xạ phân cực qua kính lọc phân cực (Định luật Malus)",
    caption:
      "So sánh nửa trên có kính phân cực xoay góc chuẩn và nửa dưới không có kính lọc trên cùng tấm kính.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Polarizer_Through_Glass.jpg",
    author: "Sbittante",
    license: "CC BY-SA 3.0",
  },
  "ce29-hieu-ung-hall-ban-dan": {
    id: "ce29-hieu-ung-hall-ban-dan",
    src: "/images/experiments/ce29-hall-sensor.jpg",
    title: "Cảm biến hiệu ứng Hall dùng lõi từ và linh kiện bán dẫn",
    caption:
      "Dòng điện chạy qua tấm bán dẫn đặt trong từ trường tạo ra hiệu điện thế Hall vuông góc.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:HallEffCurrentSense.jpg",
    author: "Wikimedia Contributor",
    license: "CC SA 1.0",
  },
  "ce30-chu-ky-phong-xa-ban-ra": {
    id: "ce30-chu-ky-phong-xa-ban-ra",
    src: "/images/experiments/ce30-geiger-counter.jpg",
    title: "Máy đếm phóng xạ với ống đếm Geiger–Müller thực tế",
    caption:
      "Ống đếm ion hóa khí ghi nhận từng hạt bức xạ phát ra từ mẫu chất phóng xạ theo thời gian.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:A_complete_Geiger_counter,_with_the_Geiger-Muller_tube_70_019.jpg",
    author: "CBRN Timo",
    license: "CC BY-SA 4.0",
  },
  "ce31-archimedes-luc-day-noi": {
    id: "ce31-archimedes-luc-day-noi",
    src: "/images/experiments/ce31-archimedes-hydrometer.jpg",
    title: "Tỉ trọng kế nổi cân bằng trong chất lỏng theo Định luật Ác-si-mét",
    caption:
      "Độ chìm của tỉ trọng kế phụ thuộc vào khối lượng riêng chất lỏng để trọng lượng cân bằng lực đẩy nổi.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hydrometer_in_action.jpg",
    author: "Jason Pratt / SilkTork",
    license: "CC BY 2.0",
  },
  "ce32-torricelli-ap-suat-khi-quyen": {
    id: "ce32-torricelli-ap-suat-khi-quyen",
    src: "/images/experiments/ce32-torricelli-barometer.jpg",
    title: "Phong vũ biểu cột thủy ngân Torricelli đo áp suất khí quyển",
    caption:
      "Cột thủy ngân trong ống kín đầu trên cân bằng đúng với áp suất khí quyển tại mặt thoáng.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Barometer,_mercury_(AM_650435).jpg",
    author: "S & B Solomon",
    license: "CC BY 4.0",
  },
  "ce33-chladni-hoa-van-song-dung-2d": {
    id: "ce33-chladni-hoa-van-song-dung-2d",
    src: "/images/experiments/ce33-chladni-pattern.jpg",
    title: "Hình hoa văn Chladni tạo từ cát mịn trên bản phẳng cộng hưởng",
    caption:
      "Hạt cát tập trung dọc theo các đường nút đứng yên của sóng dừng hai chiều trên tấm dao động.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chladni_Plate_Pattern_2.jpg",
    author: "Revisorius",
    license: "CC BY-SA 4.0",
  },
  "ce34-mach-song-xung-kich": {
    id: "ce34-mach-song-xung-kich",
    src: "/images/experiments/ce34-mach-vapor-cone.jpg",
    title: "Nón ngưng tụ sóng xung kích khi máy bay vượt tốc độ âm thanh",
    caption:
      "Tại vận tốc cận/siêu âm (M ≥ 1), các mặt sóng áp suất giao thoa tạo thành mặt nón Mach rõ rệt.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:FA-18_Hornet_breaking_sound_barrier_(7_July_1999).jpg",
    author: "Ensign John Gay (U.S. Navy)",
    license: "Public domain",
  },
  "ce35-huygens-ong-am-cong-huong": {
    id: "ce35-huygens-ong-am-cong-huong",
    src: "/images/experiments/ce35-tuning-fork-resonance.jpg",
    title: "Âm thoa chuẩn gắn trên hộp cộng hưởng gỗ khuếch đại sóng âm",
    caption:
      "Khoang khí hộp gỗ có chiều dài phù hợp cộng hưởng đúng tần số cơ bản của âm thoa phát ra.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tuning_fork_on_resonator.jpg",
    author: "Brian0918",
    license: "CC BY-SA 3.0",
  },
  "ce36-tu-dien-phong-nap-rc": {
    id: "ce36-tu-dien-phong-nap-rc",
    src: "/images/experiments/ce36-capacitor-rc.jpg",
    title: "Các tụ điện phân với điện dung khác nhau đo bằng thước tỉ lệ",
    caption: "Điện dung C quyết định trực tiếp hằng số thời gian phóng nạp τ = R·C của mạch RC.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Electrolytic_capacitors.jpg",
    author: "Omegatron",
    license: "CC BY-SA 3.0",
  },
  "ce37-kirchhoff-mach-phan-nhanh": {
    id: "ce37-kirchhoff-mach-phan-nhanh",
    src: "/images/experiments/ce37-kirchhoff-breadboard.jpg",
    title: "Mạch điện thực nghiệm phân nhánh kiểm chứng Định luật Kirchhoff",
    caption:
      "Các nút nối và vòng kín điện trở thực tế kiểm nghiệm định luật nút (ΣI = 0) và định luật vòng (ΣU = 0).",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Wooden_Breadboard_Circuits.jpg",
    author: "Miclan",
    license: "CC BY-SA 4.0",
  },
  "ce38-lorentz-quy-dao-tron-tu-truong": {
    id: "ce38-lorentz-quy-dao-tron-tu-truong",
    src: "/images/experiments/ce38-lorentz-wider.jpg",
    title: "Quỹ đạo tròn khép kín của tia electron trong bình cầu Helmholtz",
    caption:
      "Lực Lorentz đóng vai trò lực hướng tâm khiến bán kính quỹ đạo electron tỉ lệ thuận với vận tốc và tỉ lệ nghịch với B.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cyclotron_motion_wider_view.jpg",
    author: "Marcin Białek",
    license: "CC BY-SA 4.0",
  },
  "ce39-tu-cam-cuon-day-solenoid": {
    id: "ce39-tu-cam-cuon-day-solenoid",
    src: "/images/experiments/ce39-solenoid-coil.jpg",
    title: "Cuộn dây đồng quấn nhiều vòng (Solenoid) tích lũy năng lượng từ trường",
    caption: "Hệ số tự cảm L tỉ lệ với bình phương số vòng dây và tiết diện ống dây dẫn điện.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rewound_Solenoid.jpg",
    author: "tony_duell",
    license: "CC BY 2.0",
  },
  "ce40-snell-khuc-xa-phan-xa-toan-phan": {
    id: "ce40-snell-khuc-xa-phan-xa-toan-phan",
    src: "/images/experiments/ce40-total-internal-reflection.jpg",
    title: "Tia laser phản xạ toàn phần liên tiếp bên trong tấm thủy tinh huỳnh quang",
    caption:
      "Khi góc tới lớn hơn góc giới hạn i_gh, ánh sáng bị dẫn truyền hoàn toàn bên trong môi trường chiết suất lớn.",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Total_internal_reflection_by_fluorescence.jpg",
    author: "yellowcloud",
    license: "CC BY 2.0",
  },
  "ce41-compton-tan-xa-photon": {
    id: "ce41-compton-tan-xa-photon",
    src: "/images/experiments/ce41-compton-xray.jpg",
    title: "Máy phổ kế tia X lịch sử nghiên cứu tán xạ và nhiễu xạ bước sóng ngắn",
    caption:
      "Thiết bị đo bước sóng tia X tán xạ theo góc lệch khẳng định tính chất hạt – động lượng của photon.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:X-ray_spectrometer,_1912._(9660569929).jpg",
    author: "Science Museum London",
    license: "CC BY-SA 2.0",
  },
  "ce42-michelson-morley-giao-thoa": {
    id: "ce42-michelson-morley-giao-thoa",
    src: "/images/experiments/ce42-michelson-interferometer.jpg",
    title: "Hệ giao thoa kế Michelson trên bàn quang học trong phòng thí nghiệm",
    caption:
      "Hai chùm sáng vuông góc tách bởi gương bán mạ hội tụ lại tạo hệ vân giao thoa cực nhạy theo hiệu quang lộ.",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Photo_of_a_Michelson_interferometer.jpg",
    author: "Alexandra Lehtmets",
    license: "CC BY 4.0",
  },
};

export const PHOTO_FALLBACK_TEXT = "Đang cập nhật ảnh thí nghiệm thực tế.";

export function getExperimentPhoto(id: string): ExperimentPhotoMeta | null {
  return EXPERIMENT_PHOTOS[id] ?? null;
}
