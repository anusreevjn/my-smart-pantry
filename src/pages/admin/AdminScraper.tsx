import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Bot, Play, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function AdminScraper() {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScraping(true);
    setProgress(10);
    setLogs(['Initializing scraper bot...', `Target: ${url}`]);

    // Simulate scraping process (Replace with real API call to your backend/Supabase Edge Function)
    try {
      setTimeout(() => { setProgress(30); setLogs(prev => [...prev, 'Parsing HTML structure...']); }, 1000);
      setTimeout(() => { setProgress(60); setLogs(prev => [...prev, 'Found 3 recipes...', 'Extracting ingredients...']); }, 2500);
      setTimeout(() => { 
        setProgress(100); 
        setLogs(prev => [...prev, 'Successfully saved 3 recipes to database.']);
        setIsScraping(false);
        toast.success("Scraping completed successfully!");
      }, 4000);
    } catch (error) {
      setIsScraping(false);
      toast.error("Scraping failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Web Scraper</h1>
          <p className="text-muted-foreground mt-1">Automated recipe collection tool</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Enter a recipe website URL to scrape</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScrape} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Target URL</Label>
                  <Input 
                    id="url" 
                    placeholder="https://www.example.com/recipe/..." 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isScraping}
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isScraping || !url}>
                  {isScraping ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Start Scraper Bot
                    </>
                  )}
                </Button>
              </form>

              {isScraping && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" /> Live Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-md font-mono text-xs h-[200px] overflow-y-auto">
                {logs.length === 0 ? (
                  <span className="text-zinc-500">Waiting for commands...</span>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1">{`> ${log}`}</div>
                  ))
                )}
                {progress === 100 && (
                  <div className="mt-2 text-green-500 font-bold">Done.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
