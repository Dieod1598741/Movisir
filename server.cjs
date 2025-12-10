const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 🔐 로그인 API 흉내내기
server.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    const users = router.db.get("users").value();

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
        accessToken: "mock_access_token_123",
        refreshToken: "mock_refresh_token_123",
        user
    });
});

// 회원가입 (DB에 사용자 추가)
server.post("/auth/signup/request", (req, res) => {
    const { email, password } = req.body;
    const users = router.db.get("users").value();

    const exists = users.find(u => u.email === email);

    if (exists) {
        return res.status(409).json({ message: "User already exists" });
    }

    // 6자리 인증번호 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = {
        id: Date.now(),
        email,
        password,
        verificationCode, // 인증번호 저장
        verified: false
    };

    router.db.get("users").push(newUser).write();

    return res.status(201).json({
        message: "Signup request completed (test mode)",
        userId: newUser.id,
        code: verificationCode   // 🔥 실험용: 프론트에서 이 번호 받아서 사용
    });
});


server.post("/auth/signup/confirm", (req, res) => {
    const { userId, code } = req.body;

    const user = router.db.get("users")
        .find({ id: userId })
        .value();

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== code) {
        return res.status(400).json({ message: "Invalid verification code" });
    }

    // 인증 성공 처리
    user.verified = true;
    router.db.write();

    return res.json({
        message: "Verification success",
        accessToken: "mock_access_token_123",
        refreshToken: "mock_refresh_token_123",
        user
    });
});

server.get("/movies/onboarding", (req, res) => {
    // db.json의 onboardingMovies 반환
    const movies = router.db.get("onboardingMovies").value();
    // limit 처리 (query param)
    const limit = req.query.limit ? parseInt(req.query.limit) : movies.length;
    res.json(movies.slice(0, limit));
});

server.post("/onboarding/complete", (req, res) => {
    const { userId, ott, likedGenres, dislikedGenres, preferenceVector } = req.body;

    // 사용자 찾기
    const user = router.db.get("users").find({ id: userId }).value();

    if (!user) {
        // Test mode: if no user found, maybe just create a generic success or error. 
        // For strictness, let's error, but usually we should have a user.
        // However, if using mock auth, userId might be from Date.now() and matches.
        return res.status(404).json({ message: "User not found" });
    }

    // 사용자 정보 업데이트
    router.db.get("users")
        .find({ id: userId })
        .assign({
            ott,
            likedGenres,
            dislikedGenres,
            preferenceVector,
            onboardingCompleted: true
        })
        .write();

    res.json({
        onboarding_completed: true,
        message: "Onboarding data saved successfully"
    });
});

server.post("/auth/signup/resend", (req, res) => {
    // 실제 로직 없이 성공 응답만 반환
    return res.json({ message: "Verification code resent" });
});

// 기본 라우터
server.use(router);

server.listen(3001, () => {
    console.log("Mock Server running on http://localhost:3001");
});
