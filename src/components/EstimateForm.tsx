import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function EstimateForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [projectType, setProjectType] = useState("new-product");
  
  // Add effect to listen for modal toggle events
  useEffect(() => {
    const handleToggle = (e: CustomEvent) => setOpen(e.detail.open);
    document.addEventListener('toggleEstimateModal', handleToggle as EventListener);
    return () => document.removeEventListener('toggleEstimateModal', handleToggle as EventListener);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch('/api/submit-estimate', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(
        "bg-black text-white",
        "max-w-screen h-screen sm:h-auto",
        "overflow-auto",
        "max-h-[100dvh] sm:max-h-[85vh]",
        "!z-[9999]"
      )}>
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold text-white">Let's get to know your needs</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Whether you're building a new product, scoping out an MVP, or looking for trusted engineering support — we're here to help.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-green-500 text-4xl mb-4">✅</div>
            <p className="text-center text-lg">Thanks! We'll get back to you within 1 business day.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" required />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              
              <div>
                <Label htmlFor="company">Company / Project name (optional)</Label>
                <Input id="company" name="company" />
              </div>
              
              <div>
                <Label className="text-white">What are you looking for?</Label>
                <RadioGroup 
                  name="projectType" 
                  value={projectType} 
                  onValueChange={setProjectType}
                  className="mt-2 space-y-2"
                >
                  {[
                    { value: "new-product", label: "Build a new product (scoped project)" },
                    { value: "add-engineers", label: "Add engineers to my team" },
                    { value: "not-sure", label: "Not sure yet" },
                    { value: "other", label: "Something else" }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value} 
                        id={option.value}
                        className="border-white text-white"
                      />
                      <Label 
                        htmlFor={option.value} 
                        className="text-white font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {projectType === "other" && (
                  <Textarea 
                    name="otherDescription"
                    placeholder="Please describe what you're looking for..."
                    className="mt-2"
                  />
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Tell us a bit about what you're building...</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Brief description of your project or needs"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="budget">Budget or timeline (optional)</Label>
                <Input id="budget" name="budget" />
              </div>
              
              <div>
                <Label htmlFor="source">How did you hear about us?</Label>
                <Select name="source">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request →"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 