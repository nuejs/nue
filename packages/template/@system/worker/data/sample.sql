-- 50 Members (newsletter subscribers)
INSERT INTO contacts (email, country, subscribed, source, created) VALUES
('sarah.johnson@gmail.com', 'US', 1, 'www.google.com', '2025-04-15 09:23:45'),
('alex.mueller@web.de', 'DE', 1, NULL, '2025-04-18 14:12:33'),
('james.smith@outlook.com', 'GB', 1, 'news.ycombinator.com', '2025-04-22 11:45:21'),
('marie.dubois@orange.fr', 'FR', 1, 'medium.com', '2025-04-25 16:34:12'),
('yuki.tanaka@yahoo.co.jp', 'JP', 1, NULL, '2025-04-28 08:56:43'),
('carlos.silva@gmail.com', 'BR', 1, 'www.reddit.com', '2025-05-02 13:22:15'),
('emily.davis@hotmail.com', 'US', 1, 'github.com', '2025-05-05 10:17:29'),
('thomas.wagner@gmx.de', 'DE', 1, 'www.google.com', '2025-05-08 15:43:52'),
('olivia.brown@yahoo.co.uk', 'GB', 1, NULL, '2025-05-12 12:31:47'),
('pierre.martin@free.fr', 'FR', 1, 'substack.com', '2025-05-15 09:18:33'),
('hiroshi.sato@gmail.com', 'JP', 1, 'www.linkedin.com', '2025-05-18 14:52:21'),
('ana.santos@uol.com.br', 'BR', 1, NULL, '2025-05-21 11:27:45'),
('michael.wilson@gmail.com', 'US', 1, 't.co', '2025-05-24 16:14:18'),
('lisa.schneider@t-online.de', 'DE', 1, 'duckduckgo.com', '2025-05-27 08:39:52'),
('david.taylor@btinternet.com', 'GB', 1, NULL, '2025-05-30 13:45:36'),
('sophie.bernard@gmail.com', 'FR', 1, 'api.daily.dev', '2025-06-02 10:22:14'),
('kenji.nakamura@docomo.ne.jp', 'JP', 1, 'www.bing.com', '2025-06-05 15:51:28'),
('ricardo.oliveira@hotmail.com', 'BR', 1, NULL, '2025-06-08 12:17:42'),
('jennifer.martinez@yahoo.com', 'US', 1, 'search.brave.com', '2025-04-20 14:33:56'),
('hans.fischer@web.de', 'DE', 1, 'news.ycombinator.com', '2025-04-23 09:45:12'),
('charlotte.jones@gmail.com', 'GB', 1, NULL, '2025-04-26 16:28:34'),
('luc.moreau@wanadoo.fr', 'FR', 1, 'www.ecosia.org', '2025-04-29 11:14:27'),
('sakura.yamamoto@softbank.ne.jp', 'JP', 1, 'www.reddit.com', '2025-05-03 08:37:19'),
('pedro.costa@gmail.com', 'BR', 1, NULL, '2025-05-06 13:52:45'),
('robert.clark@hotmail.com', 'US', 1, 'github.com', '2025-05-09 10:41:33'),
('inge.hoffmann@gmx.de', 'DE', 1, 'medium.com', '2025-05-13 15:19:58'),
('george.white@sky.com', 'GB', 1, NULL, '2025-05-16 12:36:22'),
('claire.rousseau@laposte.net', 'FR', 1, 'www.google.com', '2025-05-19 09:54:17'),
('taro.suzuki@nifty.com', 'JP', 1, 'substack.com', '2025-05-22 14:28:41'),
('lucia.ferreira@terra.com.br', 'BR', 1, NULL, '2025-05-25 11:15:29'),
('kevin.thompson@gmail.com', 'US', 1, 'www.linkedin.com', '2025-05-28 16:43:52'),
('petra.klein@t-online.de', 'DE', 1, 't.co', '2025-05-31 08:21:35'),
('harry.evans@virgin.net', 'GB', 1, NULL, '2025-06-03 13:57:48'),
('antoine.durand@sfr.fr', 'FR', 1, 'api.daily.dev', '2025-06-06 10:32:16'),
('mai.kobayashi@yahoo.co.jp', 'JP', 1, 'duckduckgo.com', '2025-04-17 15:26:43'),
('bruno.pereira@bol.com.br', 'BR', 1, NULL, '2025-04-21 12:48:57'),
('ashley.harris@outlook.com', 'US', 1, 'www.bing.com', '2025-04-24 09:35:21'),
('stefan.weber@web.de', 'DE', 1, 'search.brave.com', '2025-04-27 14:12:48'),
('lucy.walker@tiscali.co.uk', 'GB', 1, NULL, '2025-04-30 11:59:33'),
('jean.leclerc@club-internet.fr', 'FR', 1, 'www.ecosia.org', '2025-05-04 16:47:26'),
('akira.watanabe@au.com', 'JP', 1, 'news.ycombinator.com', '2025-05-07 08:24:19'),
('mariana.alves@ig.com.br', 'BR', 1, NULL, '2025-05-10 13:41:52'),
('daniel.lee@verizon.net', 'US', 1, 'www.reddit.com', '2025-05-14 10:18:37'),
('birgit.schulz@gmx.de', 'DE', 1, 'github.com', '2025-05-17 15:55:44'),
('paul.robinson@o2.co.uk', 'GB', 1, NULL, '2025-05-20 12:33:28'),
('camille.robert@alice.fr', 'FR', 1, 'medium.com', '2025-05-23 09:16:51'),
('yuki.inoue@biglobe.ne.jp', 'JP', 1, 'substack.com', '2025-05-26 14:42:15'),
('rafael.souza@globo.com', 'BR', 1, NULL, '2025-05-29 11:27:39'),
('michelle.garcia@aol.com', 'US', 1, 'www.google.com', '2025-06-01 16:53:22'),
('wolfgang.bauer@yahoo.de', 'DE', 1, 'www.linkedin.com', '2025-06-04 08:31:45');

-- 25 Sales contacts
INSERT INTO contacts (email, name, country, subscribed, source, website, created) VALUES
('john.peterson@techcorp.com', 'John Peterson', 'US', 0, 'www.linkedin.com', 'https://techcorp.com', '2025-04-16 10:45:23'),
('anna.schulte@innovate.de', 'Anna Schulte', 'DE', 1, NULL, 'https://innovate.de', '2025-04-19 14:22:17'),
('richard.thompson@dataflow.co.uk', 'Richard Thompson', 'GB', 0, 'github.com', 'https://dataflow.co.uk', '2025-04-22 09:33:41'),
('isabelle.moreau@digitech.fr', 'Isabelle Moreau', 'FR', 1, 'www.google.com', 'https://digitech.fr', '2025-04-25 16:17:55'),
('takeshi.yamada@cloudtech.jp', 'Takeshi Yamada', 'JP', 0, NULL, 'https://cloudtech.jp', '2025-04-28 11:48:29'),
('fernando.santos@innovabr.com.br', 'Fernando Santos', 'BR', 1, 'news.ycombinator.com', 'https://innovabr.com.br', '2025-05-01 13:25:43'),
('sarah.collins@nexustech.com', 'Sarah Collins', 'US', 0, 'medium.com', 'https://nexustech.com', '2025-05-04 08:52:16'),
('marcus.hoffmann@futureware.de', 'Marcus Hoffmann', 'DE', 1, NULL, 'https://futureware.de', '2025-05-07 15:39:28'),
('helen.ward@smartsys.co.uk', 'Helen Ward', 'GB', 0, 'www.reddit.com', 'https://smartsys.co.uk', '2025-05-10 12:14:52'),
('philippe.martin@webpro.fr', 'Philippe Martin', 'FR', 1, 'substack.com', 'https://webpro.fr', '2025-05-13 09:41:37'),
('hiroki.tanaka@digitalsol.jp', 'Hiroki Tanaka', 'JP', 0, NULL, 'https://digitalsol.jp', '2025-05-16 14:26:19'),
('carlos.rodrigues@techmind.com.br', 'Carlos Rodrigues', 'BR', 1, 't.co', 'https://techmind.com.br', '2025-05-19 11:53:44'),
('david.miller@alphatech.com', 'David Miller', 'US', 0, 'api.daily.dev', 'https://alphatech.com', '2025-05-22 16:18:31'),
('sabine.fischer@quantum.de', 'Sabine Fischer', 'DE', 1, NULL, 'https://quantum.de', '2025-05-25 08:45:27'),
('james.clark@velocity.co.uk', 'James Clark', 'GB', 0, 'duckduckgo.com', 'https://velocity.co.uk', '2025-05-28 13:32:15'),
('marie.bernard@nexwave.fr', 'Marie Bernard', 'FR', 1, 'www.bing.com', 'https://nexwave.fr', '2025-05-31 10:27:48'),
('kenji.sato@streamtech.jp', 'Kenji Sato', 'JP', 0, NULL, 'https://streamtech.jp', '2025-06-03 15:14:33'),
('patricia.lima@digibras.com.br', 'Patricia Lima', 'BR', 1, 'search.brave.com', 'https://digibras.com.br', '2025-06-06 12:58:21'),
('robert.anderson@coretech.com', 'Robert Anderson', 'US', 0, 'www.ecosia.org', 'https://coretech.com', '2025-04-20 09:37:54'),
('greta.muller@innovatech.de', 'Greta Muller', 'DE', 1, NULL, 'https://innovatech.de', '2025-04-23 14:51:42'),
('andrew.wilson@cybernet.co.uk', 'Andrew Wilson', 'GB', 0, 'github.com', 'https://cybernet.co.uk', '2025-04-26 11:19:36'),
('sylvie.dubois@techvision.fr', 'Sylvie Dubois', 'FR', 1, 'www.linkedin.com', 'https://techvision.fr', '2025-04-29 16:44:28'),
('masaki.honda@hypertech.jp', 'Masaki Honda', 'JP', 0, NULL, 'https://hypertech.jp', '2025-05-02 08:31:17'),
('ricardo.machado@cloudware.com.br', 'Ricardo Machado', 'BR', 1, 'news.ycombinator.com', 'https://cloudware.com.br', '2025-05-05 13:46:59'),
('karen.taylor@digitech.com', 'Karen Taylor', 'US', 0, 'medium.com', 'https://digitech.com', '2025-05-08 10:23:41');



-- Member comments (quick one-liners about performance/design)
UPDATE contacts SET comment = 'Love the speed focus!' WHERE email = 'sarah.johnson@gmail.com';
UPDATE contacts SET comment = 'Finally, minimal design that works' WHERE email = 'james.smith@outlook.com';
UPDATE contacts SET comment = 'Web standards FTW' WHERE email = 'marie.dubois@orange.fr';
UPDATE contacts SET comment = 'CSS wizardry impressed me' WHERE email = 'emily.davis@hotmail.com';
UPDATE contacts SET comment = 'Clean code = clean design' WHERE email = 'olivia.brown@yahoo.co.uk';
UPDATE contacts SET comment = 'Performance metrics blew my mind' WHERE email = 'hiroshi.sato@gmail.com';
UPDATE contacts SET comment = 'Separation of concerns done right' WHERE email = 'michael.wilson@gmail.com';
UPDATE contacts SET comment = 'Minimalism but maximum impact' WHERE email = 'david.taylor@btinternet.com';
UPDATE contacts SET comment = 'Content-first approach is genius' WHERE email = 'kenji.nakamura@docomo.ne.jp';
UPDATE contacts SET comment = 'No bloat, just results' WHERE email = 'jennifer.martinez@yahoo.com';
UPDATE contacts SET comment = 'Semantic HTML appreciation' WHERE email = 'charlotte.jones@gmail.com';
UPDATE contacts SET comment = 'Design systems done properly' WHERE email = 'sakura.yamamoto@softbank.ne.jp';
UPDATE contacts SET comment = 'Performance budget respect' WHERE email = 'robert.clark@hotmail.com';
UPDATE contacts SET comment = 'Progressive enhancement rocks' WHERE email = 'george.white@sky.com';
UPDATE contacts SET comment = 'Accessibility built-in, not bolted-on' WHERE email = 'taro.suzuki@nifty.com';
UPDATE contacts SET comment = 'Core Web Vitals champion' WHERE email = 'kevin.thompson@gmail.com';
UPDATE contacts SET comment = 'Standards compliance beauty' WHERE email = 'harry.evans@virgin.net';
UPDATE contacts SET comment = '100/100 Lighthouse scores possible!' WHERE email = 'mai.kobayashi@yahoo.co.jp';
UPDATE contacts SET comment = 'CSS architecture masterclass' WHERE email = 'ashley.harris@outlook.com';
UPDATE contacts SET comment = 'Form follows function perfection' WHERE email = 'jean.leclerc@club-internet.fr';

-- Sales comments (action-oriented questions about implementation)
UPDATE contacts SET comment = 'Interested in enterprise design system implementation - what packages do you offer?' WHERE email = 'john.peterson@techcorp.com';
UPDATE contacts SET comment = 'Need to rebuild our webapp with better performance. Can we schedule a technical discussion?' WHERE email = 'anna.schulte@innovate.de';
UPDATE contacts SET comment = 'Evaluating template solutions for 50+ landing pages. What customization options are available?' WHERE email = 'richard.thompson@dataflow.co.uk';
UPDATE contacts SET comment = 'Our current site scores 40 on Lighthouse. How quickly can you help us reach 90+?' WHERE email = 'takeshi.yamada@cloudtech.jp';
UPDATE contacts SET comment = 'Looking for content-first CMS integration. Do your templates support headless architecture?' WHERE email = 'fernando.santos@innovabr.com.br';
UPDATE contacts SET comment = 'Team wants to adopt your CSS methodology. Do you offer training or documentation?' WHERE email = 'sarah.collins@nexustech.com';
UPDATE contacts SET comment = 'Impressed by separation of concerns approach. Can we see case studies from similar B2B companies?' WHERE email = 'helen.ward@smartsys.co.uk';
UPDATE contacts SET comment = 'Need white-label solution for client projects. What licensing terms do you offer?' WHERE email = 'philippe.martin@webpro.fr';
UPDATE contacts SET comment = 'Our dev team struggles with performance optimization. Do you provide consulting services?' WHERE email = 'carlos.rodrigues@techmind.com.br';
UPDATE contacts SET comment = 'Considering migration from React bloat to web standards. What migration path do you recommend?' WHERE email = 'david.miller@alphatech.com';
UPDATE contacts SET comment = 'Budget approved for Q3 redesign. Can we discuss enterprise pricing and timeline?' WHERE email = 'james.clark@velocity.co.uk';
UPDATE contacts SET comment = 'Multi-language site requirements. How do your templates handle internationalization?' WHERE email = 'marie.bernard@nexwave.fr';
UPDATE contacts SET comment = 'Compliance team loves your accessibility approach. What WCAG level do you guarantee?' WHERE email = 'patricia.lima@digibras.com.br';
UPDATE contacts SET comment = 'Need templates that work with our existing CI/CD pipeline. What build tools do you support?' WHERE email = 'robert.anderson@coretech.com';
UPDATE contacts SET comment = 'Stakeholders want proof of performance claims. Can you share before/after metrics from similar projects?' WHERE email = 'andrew.wilson@cybernet.co.uk';