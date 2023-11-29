-- DATABASE_SQL.SQL
-- Creates the database of verbs used by this project
-- Run command: sqlite3 jp_verbs.db < database_sql.sql

-- Drop tables if they already exist
DROP TABLE IF EXISTS verbs;
DROP TABLE IF EXISTS conjugations;
DROP TABLE IF EXISTS irregulars;

CREATE TABLE verbs(
    verb_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    form TEXT, -- Japanese verb in plain form ending in 'u' sound
    kanji_reading TEXT, -- hiragana for reading of kanji; blank if no kanji present
    okurigana TEXT, -- hirargana that follows the kanji
    is_ru_verb INTEGER, -- true means it's a 'ru' verb, false means it's a 'u' verb
    meaning TEXT -- english meaning of verb
);



/* -- Removed due to failure to represent complex Japanese verb conjugations using this format
CREATE TABLE conjugations(
    conjugation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conjugation_name TEXT, -- polite, past, stem...
    base_conjugation INTEGER, -- FK what conjugation must be done first in order to do this conjugation
    drop_chars TEXT, -- characters to drop/change
    add_chars TEXT -- characters to add
);*/

CREATE TABLE irregulars(
    verb_id INTEGER, -- FK from VERBS table
    conjugation_name TEXT, -- exact name of conjugation
    form TEXT, -- conjugated form of verb
    kanji_reading TEXT, -- hiragana for reading of kanji; blank if no kanji present
    okurigana TEXT, -- hirargana that follows the kanji
    is_ru_verb INTEGER -- whether the current form can be treated as a ru-verb. NULL means the conjugation is not in plain form
);


INSERT INTO verbs(form, kanji_reading, okurigana, is_ru_verb, meaning)
VALUES
    ('する','','する',1,'to do'), -- irr.
    ('来る','く','る',1,'to come'), -- irr.
    ('行く','い','く',0,'to go'), -- sometimes irr
    ('知る','し','る',0,'to know'),
    ('食べる','た','べる',1,'to eat'),
    ('飲む','の','む',0,'to drink'),
    ('信じる','しん','じる',1,'to believe'),
    ('頼む','たの','む',0,'to ask for'),
    ('呼ぶ','よ','ぶ',0,'to call out'),
    ('死ぬ','し','ぬ',0,'to die'),
    ('立つ','た','つ',0,'to stand'),
    ('返す','かえ','す',0,'to return something'),
    ('買う','か','う',0,'to buy'),
    ('泳ぐ','およ','ぐ',0,'to swim'),
    ('寝る','ね','る',1,'to sleep'),
    ('教える','おし','える',1,'to teach'),
    ('殺す','ころ','す',0,'to kill'),
    ('学ぶ','まな','ぶ',0,'to learn'),
    ('始める','はじ','める',1,'to start'),
    ('終わる','お','わる',0,'to end'),
    ('開ける','あ','ける',1,'to open'),
    ('閉める','し','める',1,'to close'),
    ('着く','つ','く',0,'to arrive'),
    ('着る','き','る',1,'to wear'),
    ('殴る','なぐ','る',0,'to punch'),
    ('気づく','き','づく',0,'to notice'),
    ('貸す','か','す',0,'to lend'),
    ('続ける','つづ','ける',1,'to continue'),
    ('歩く','ある','く',0,'to walk'),
    ('走る','はし','る',0,'to run'),
    ('戻る','もど','る',0,'to return'),
    ('変える','か','える',1,'to change'),
    ('書く','か','く',0,'to write'),
    ('覚える','おぼ','える',1,'to memorize'),
    ('出す','だ','す',0,'to take out'),
    ('誘う','さそ','う',0,'to invite'),
    ('遊ぶ','あそ','ぶ',0,'to play'),
    ('向く','む','く',0,'to turn toward');
 --    ('','','',0,'to '),


INSERT INTO irregulars(verb_id, conjugation_name, form, kanji_reading, okurigana, is_ru_verb)
VALUES
    (1,'stem','し','','し',NULL),
    (1,'te','して','','して',NULL),
    (1,'volitional','しよう','','しよう',NULL),
    (1,'potential','できる','','できる',1),
    (1,'causative','させる','','させる',1),
    (1,'passive','される','','される',1),
    (2,'stem','来','き','',NULL),
    (2,'negative','来ない','こ','ない',NULL),
    (2,'te','来て','き','て',NULL),
    (2,'volitional','来よう','こ','よう',NULL),
    (2,'command','来い','こ','い',NULL),
    (2,'potential','来られる','こ','られる',1),
    (2,'causative','来させる','こ','させる',1),
    (2,'passive','来られる','こ','られる',1),
    (3,'te','行って','い','って',NULL);