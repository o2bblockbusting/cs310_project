-- DATABASE_SQL.SQL
-- Creates the database of verbs used by this project
-- Run command: sqlite3 jp_verbs.db < database_sql.sql

-- Drop tables if they already exist
DROP TABLE IF EXISTS verbs;
DROP TABLE IF EXISTS conjugations;
DROP TABLE IF EXISTS irregulars;

CREATE TABLE verbs(
    verb_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    verb_plain TEXT, -- Japanese verb in plain form ending in 'u' sound
    kanji_reading TEXT, -- hiragana for reading of kanji; blank if no kanji present
    okurigana TEXT, -- hirargana that follows the kanji
    is_ru_verb INTEGER -- true means it's a 'ru' verb, false means it's a 'u' verb
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
    conjugated_verb TEXT, -- conjugated form of verb
    kanji_reading TEXT, -- hiragana for reading of kanji; blank if no kanji present
    okurigana TEXT -- hirargana that follows the kanji
);


INSERT INTO verbs(verb_plain, kanji_reading, okurigana, is_ru_verb)
VALUES
    ('する','','する',1), -- irr.
    ('来る','く','る',1), -- irr.
    ('行く','い','く',0), -- sometimes irr
    ('知る','し','る',0),
    ('食べる','た','べる',1),
    ('飲む','の','む',0),
    ('信じる','しん','じる',1),
    ('頼む','たの','む',0),
    ('呼ぶ','よ','ぶ',0),
    ('死ぬ','し','ぬ',0),
    ('立つ','た','つ',0),
    ('返す','かえ','す',0),
    ('買う','か','う',0),
    ('泳ぐ','およ','ぐ',0),
    ('寝る','ね','る',1);
 --    ('','','',0),


INSERT INTO irregulars(verb_id, conjugation_name, conjugated_verb, kanji_reading, okurigana)
VALUES
    (1,'stem','し','','し'),
    (1,'potential','できる','','できる'),
    (1,'causative','させる','','させる'),
    (1,'passive','される','','される'),
    (2,'stem','来','き',''),
    (2,'negative','来ない','こ','ない'),
    (2,'te-form','来て','き','て'),
    (2,'volitional','来よう','こ','よう'),
    (2,'command','来い','こ','い'),
    (2,'potential','来られる','こ','られる'),
    (2,'causative','来させる','こ','させる'),
    (2,'passive','来られる','こ','られる'),
    (3,'te-form','行って','い','って');