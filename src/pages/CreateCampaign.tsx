import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCampaigns } from "@/context/CampaignContext";
import { Upload, IndianRupee, Heart, Sparkles, AlertTriangle } from "lucide-react";

// Define validation schema
const formSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title too long"),
    story: z.string().min(50, "Please provide more detail about the cause"),
    category: z.enum(["people", "causes"]),
    subcategory: z.string().min(1, "Please select a subcategory"),
    goalAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1000, {
        message: "Goal must be at least ₹1,000",
    }),
    beneficiaryName: z.string().min(2, "Name required"),
    location: z.string().min(2, "Location required"),
    urgencyLevel: z.enum(["critical", "high", "medium", "low"]),
    imageUrl: z.string().optional(), // In a real app, this would be a file validation
});

const CreateCampaign = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { addCampaign } = useCampaigns();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            story: "",
            category: "people",
            subcategory: "",
            goalAmount: "",
            beneficiaryName: "",
            location: "",
            urgencyLevel: "medium",
            imageUrl: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        // Simulate network delay for verification
        toast({
            title: "Verifying Documents...",
            description: "Checking identity and medical records securely on-chain.",
            duration: 2000,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newCampaign = {
            id: Math.random().toString(36).substr(2, 9),
            title: values.title,
            story: values.story,
            category: values.category as "people" | "causes",
            subcategory: values.subcategory as any,
            goalAmount: Number(values.goalAmount),
            raisedAmount: 0,
            donorCount: 0,
            daysLeft: 30,
            urgencyLevel: values.urgencyLevel,
            isVerified: true, // Auto-verified for demo
            beneficiaryName: values.beneficiaryName,
            location: values.location,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Use placeholder if no image provided/uploaded
            imageUrl: imagePreview || "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800",
        };

        addCampaign(newCampaign);

        toast({
            title: "Campaign Verified & Live! ✅",
            description: "Your fundraiser has been verified and is now accepting donations.",
            duration: 5000,
        });

        navigate("/");
        setIsSubmitting(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">

                    <div className="mb-10 text-center animate-fade-in">
                        <h1 className="font-display text-4xl font-bold mb-4">Start a Fundraiser</h1>
                        <p className="text-muted-foreground text-lg">
                            Create a campaign to support a cause closest to your heart.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card animate-slide-up">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-xl flex items-center gap-2 border-b border-border pb-2">
                                        <AlertTriangle className="w-5 h-5 text-primary" />
                                        Campaign Details
                                    </h3>

                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Campaign Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Help Save Baby Ananya" {...field} className="text-lg" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="people">Medical / Personal</SelectItem>
                                                            <SelectItem value="causes">Social Cause / NGO</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subcategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sub-category</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Surgery, Education" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="urgencyLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Urgency Level</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select urgency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low (Ongoing)</SelectItem>
                                                        <SelectItem value="medium">Medium (Active)</SelectItem>
                                                        <SelectItem value="high">High (Urgent)</SelectItem>
                                                        <SelectItem value="critical">Critical (Immediate Help Needed)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Story Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-xl flex items-center gap-2 border-b border-border pb-2">
                                        <Heart className="w-5 h-5 text-primary" />
                                        Tell Your Story
                                    </h3>

                                    <FormField
                                        control={form.control}
                                        name="story"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>About the Campaign</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Share the details... Why is this urgent? How will the funds be used?"
                                                        className="min-h-[150px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Financials Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-xl flex items-center gap-2 border-b border-border pb-2">
                                        <IndianRupee className="w-5 h-5 text-primary" />
                                        Goal & Beneficiary
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="goalAmount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Goal Amount (₹)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input type="number" placeholder="500000" className="pl-9" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="beneficiaryName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Beneficiary Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Who are you raising funds for?" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City, State" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-xl flex items-center gap-2 border-b border-border pb-2">
                                        <Upload className="w-5 h-5 text-primary" />
                                        Campaign Image
                                    </h3>

                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 hover:bg-muted/10 transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('image-upload')?.click()}>

                                        {imagePreview ? (
                                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <p className="text-white font-medium">Click to change</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Upload className="w-6 h-6 text-primary" />
                                                </div>
                                                <p className="text-sm font-medium">Click to upload cover image</p>
                                                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF</p>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" size="lg" className="w-full gradient-heart text-lg" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="animate-spin" /> Creating...
                                            </span>
                                        ) : "Launch Campaign"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateCampaign;
