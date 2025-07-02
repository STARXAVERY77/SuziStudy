import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon = Construction,
}: PlaceholderPageProps) {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-lg">{description}</p>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon! We're working hard to bring you an
                amazing experience.
              </p>
              <Button asChild className="mt-6">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
