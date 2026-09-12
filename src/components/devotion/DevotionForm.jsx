import React, { useEffect, useState } from "react";
import db from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Sparkles, X, ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { BIBLE_BOOKS } from "@/lib/bibleData";

const API_BIBLE_BOOK_IDS = {
  Genesis: "GEN", Exodus: "EXO", Leviticus: "LEV", Numbers: "NUM", Deuteronomy: "DEU",
  Joshua: "JOS", Judges: "JDG", Ruth: "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Kings": "1KI", "2 Kings": "2KI", "1 Chronicles": "1CH", "2 Chronicles": "2CH",
  Ezra: "EZR", Nehemiah: "NEH", Esther: "EST", Job: "JOB", Psalms: "PSA", Proverbs: "PRO",
  Ecclesiastes: "ECC", "Song of Solomon": "SNG", Isaiah: "ISA", Jeremiah: "JER", Lamentations: "LAM",
  Ezekiel: "EZK", Daniel: "DAN", Hosea: "HOS", Joel: "JOL", Amos: "AMO", Obadiah: "OBA",
  Jonah: "JON", Micah: "MIC", Nahum: "NAM", Habakkuk: "HAB", Zephaniah: "ZEP", Haggai: "HAG",
  Zechariah: "ZEC", Malachi: "MAL", Matthew: "MAT", Mark: "MRK", Luke: "LUK", John: "JHN",
  Acts: "ACT", Romans: "ROM", "1 Corinthians": "1CO", "2 Corinthians": "2CO", Galatians: "GAL",
  Ephesians: "EPH", Philippians: "PHP", Colossians: "COL", "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH", "1 Timothy": "1TI", "2 Timothy": "2TI", Titus: "TIT", Philemon: "PHM",
  Hebrews: "HEB", James: "JAS", "1 Peter": "1PE", "2 Peter": "2PE", "1 John": "1JN",
  "2 John": "2JN", "3 John": "3JN", Jude: "JUD", Revelation: "REV",
};

export default function DevotionForm({
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
  initialVerse = "",
  initialNotes = "",
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [showPreview, setShowPreview] = useState(true);
  const [passagePreview, setPassagePreview] = useState("");
  const [passageLoading, setPassageLoading] = useState(false);
  const [passageError, setPassageError] = useState("");
  const [isVerseLocked, setIsVerseLocked] = useState(Boolean(initialVerse));
  const [bibleVersion, setBibleVersion] = useState({
    id: import.meta.env.VITE_NLT_BIBLE_ID || "",
    name: "New Living Translation",
    abbreviation: "NLT",
  });

  const today = format(new Date(), "MMMM d, yyyy");

  const parseInitialVerse = () => {
    if (!initialVerse) return { book: "", chapter: "", verseStart: "", verseEnd: "" };
    const match = initialVerse.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (match) {
      return {
        book: match[1],
        chapter: match[2],
        verseStart: match[3],
        verseEnd: match[4] || "",
      };
    }
    return { book: initialVerse, chapter: "", verseStart: "", verseEnd: "" };
  };

  const parsed = parseInitialVerse();
  const [selectedBook, setSelectedBook] = useState(parsed.book);
  const [selectedChapter, setSelectedChapter] = useState(parsed.chapter);
  const [verseStart, setVerseStart] = useState(parsed.verseStart);
  const [verseEnd, setVerseEnd] = useState(parsed.verseEnd);

  useEffect(() => {
    const nextVerse = parseInitialVerse();
    setSelectedBook(nextVerse.book);
    setSelectedChapter(nextVerse.chapter);
    setVerseStart(nextVerse.verseStart);
    setVerseEnd(nextVerse.verseEnd);
    setNotes(initialNotes);
    setIsVerseLocked(Boolean(initialVerse));
  }, [initialVerse, initialNotes]);

  useEffect(() => {
    let cancelled = false;

    async function loadBibleVersion() {
      try {
        const user = await db.auth.me();
        const savedVersion = user?.user_metadata?.bible_version;
        if (savedVersion?.id && !cancelled) setBibleVersion(savedVersion);
      } catch (error) {
        console.warn("Could not load preferred Bible version", error);
      }
    }

    loadBibleVersion();
    return () => {
      cancelled = true;
    };
  }, []);

  const bookData = BIBLE_BOOKS.find((b) => b.name === selectedBook);
  const chapterCount = bookData?.chapters?.length || 0;
  const verseCount =
    bookData && selectedChapter ? bookData.chapters[parseInt(selectedChapter) - 1] || 0 : 0;

  const handleBookChange = (val) => {
    setSelectedBook(val);
    setSelectedChapter("");
    setVerseStart("");
    setVerseEnd("");
  };

  const handleChapterChange = (val) => {
    setSelectedChapter(val);
    setVerseStart("");
    setVerseEnd("");
  };

  const getVerseString = () => {
    if (!selectedBook || !selectedChapter || !verseStart) return "";
    return verseEnd
      ? `${selectedBook} ${selectedChapter}:${verseStart}-${verseEnd}`
      : `${selectedBook} ${selectedChapter}:${verseStart}`;
  };

  const verse = getVerseString();

  const getApiBiblePassageId = () => {
    const bookId = API_BIBLE_BOOK_IDS[selectedBook];
    if (!bookId || !selectedChapter || !verseStart) return "";

    const start = `${bookId}.${selectedChapter}.${verseStart}`;
    return verseEnd ? `${start}-${bookId}.${selectedChapter}.${verseEnd}` : start;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verse || !notes.trim()) return;
    onSubmit({ verse, notes: notes.trim() });
  };

  const verseOptions = verseCount > 0 ? Array.from({ length: verseCount }, (_, i) => i + 1) : [];

  useEffect(() => {
    let cancelled = false;

    async function fetchPassage() {
      if (!verse) {
        setPassagePreview("");
        setPassageError("");
        setPassageLoading(false);
        return;
      }

      const apiKey = import.meta.env.VITE_API_BIBLE_KEY;
      const bibleId = bibleVersion.id || import.meta.env.VITE_NLT_BIBLE_ID;

      if (!apiKey || !bibleId) {
        setPassagePreview("");
        setPassageError("Missing API.Bible environment variables.");
        setPassageLoading(false);
        return;
      }

      setPassageLoading(true);
      setPassageError("");

      try {
        const headers = { "api-key": apiKey };
        const passageId = getApiBiblePassageId();
        let text = "";

        if (passageId) {
          const url = new URL(`https://rest.api.bible/v1/bibles/${bibleId}/passages/${passageId}`);
          url.searchParams.set("content-type", "html");
          url.searchParams.set("include-notes", "false");
          url.searchParams.set("include-titles", "true");
          url.searchParams.set("include-chapter-numbers", "false");
          url.searchParams.set("include-verse-numbers", "true");

          const response = await fetch(url.toString(), { headers });
          if (response.ok) {
            const data = await response.json();
            text = data?.data?.content || "";
          }
        }

        if (!text) {
          const searchUrl = new URL(`https://rest.api.bible/v1/bibles/${bibleId}/search`);
          searchUrl.searchParams.set("query", verse);
          searchUrl.searchParams.set("content-type", "html");

          const res = await fetch(searchUrl.toString(), {
          headers: {
            "api-key": apiKey,
          },
          });

          if (!res.ok) {
            throw new Error(`Passage lookup failed (${res.status})`);
          }

          const data = await res.json();
          text =
            data?.data?.passages?.[0]?.content ||
            data?.data?.passages?.[0]?.text ||
            data?.data?.verses?.[0]?.content ||
            data?.data?.verses?.[0]?.text ||
            "";
        }

        if (cancelled) return;

        setPassagePreview(text || "No passage text returned.");
      } catch (err) {
        if (!cancelled) {
          setPassagePreview("");
          setPassageError(err?.message || "Could not load passage.");
        }
      } finally {
        if (!cancelled) setPassageLoading(false);
      }
    }

    const timer = setTimeout(fetchPassage, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [verse, bibleVersion.id]);

  const formattedPassage = passagePreview.replace(
  /<span[^>]*class="v"[^>]*>(\d+)<\/span>/g,
  '<span class="font-semibold text-primary mr-2 inline-block min-w-[1.25rem]">$1</span>'
);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="font-display flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-primary" />
              {isEditing ? "Edit Devotion" : "Today's Devotion"}
            </CardTitle>
            <div className="flex items-center gap-2">
              {onCancel && (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onCancel}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{today}</p>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bible Verse</label>

              {initialVerse && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={isVerseLocked}
                  onClick={() => setIsVerseLocked((current) => !current)}
                  className="w-full flex items-center justify-between gap-3 rounded-xl border bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {isVerseLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Unlock className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      <span className="block font-medium">
                        {isVerseLocked ? "Book, Chapter, and Verses are Locked" : "Bible passage override enabled"}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {isVerseLocked
                          ? "Reading is based on Endure 2026, Superbook. Turn this off if you want to change or extend today's assigned reading."
                          : "You can choose a different or longer passage."}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      isVerseLocked ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
                        isVerseLocked ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </span>
                </button>
              )}

              <Select value={selectedBook} onValueChange={handleBookChange} disabled={isVerseLocked}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Book…" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {BIBLE_BOOKS.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedBook && (
                <Select value={selectedChapter} onValueChange={handleChapterChange} disabled={isVerseLocked}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Chapter…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {Array.from({ length: chapterCount }, (_, i) => i + 1).map((c) => (
                      <SelectItem key={c} value={String(c)}>
                        Chapter {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {selectedChapter && verseCount > 0 && (
                <div className="flex items-center gap-2">
                  <Select
                    value={verseStart}
                    disabled={isVerseLocked}
                    onValueChange={(v) => {
                      setVerseStart(v);
                      setVerseEnd("");
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Verse" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {verseOptions.map((v) => (
                        <SelectItem key={v} value={String(v)}>
                          v. {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {verseStart && (
                    <>
                      <span className="text-sm text-muted-foreground shrink-0">to (optional)</span>
                      <Select
                        value={verseEnd || "__none__"}
                        disabled={isVerseLocked}
                        onValueChange={(v) => setVerseEnd(v === "__none__" ? "" : v)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="End verse" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          <SelectItem value="__none__">—</SelectItem>
                          {verseOptions
                            .filter((v) => v > parseInt(verseStart))
                            .map((v) => (
                              <SelectItem key={v} value={String(v)}>
                                v. {v}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={() => setShowPreview((s) => !s)}
                disabled={!verse}
              >
                <span className="flex items-center gap-2">
                  {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showPreview ? "Hide Passage Preview" : "Show Passage Preview"}
                </span>
                <span className="text-xs text-muted-foreground">{bibleVersion.abbreviation || "NLT"}</span>
              </Button>

              <AnimatePresence>
                {showPreview && verse && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border bg-muted/20 p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">Selected Passage</p>

                      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex-wrap">
                        📖 {verse}
                      </div>

                      {passageLoading ? (
                        <p className="text-sm text-muted-foreground">Loading passage...</p>
                      ) : passageError ? (
                        <p className="text-sm text-red-600">{passageError}</p>
                      ) : (
                       <div className="rounded-xl border bg-muted/20 p-4">
  <div
    className="prose prose-slate max-w-none text-sm leading-7 text-justify"
    dangerouslySetInnerHTML={{
      __html: formattedPassage || "<p>Passage preview will appear here.</p>",
    }}
  />
</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Devotion Notes</label>
              <Textarea
                placeholder="What did God speak to you today? Write your reflections, prayers, or insights..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[420px] resize-y leading-7 text-base p-4"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-display"
              disabled={!verse || !notes.trim() || isSubmitting}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Complete Devotion"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
