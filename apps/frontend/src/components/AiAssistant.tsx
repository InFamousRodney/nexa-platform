
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, ThumbsUp, SendHorizontal } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const sampleQuestions = [
  "What impact would deleting the 'Status__c' field on Account have?",
  "Identify unused custom fields on the Opportunity object",
  "Explain the data flow between Lead and Contact objects",
  "What testing coverage exists for OpportunityTrigger?",
];

export function AiAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateDemoResponse(input),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions about your Salesforce metadata
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 p-2">
        {messages.length === 0 ? (
          <div className="space-y-2 text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Start by asking a question about your metadata
            </p>
            <div className="grid grid-cols-1 gap-2">
              {sampleQuestions.map((question) => (
                <Button 
                  key={question} 
                  variant="outline" 
                  className="text-xs justify-start h-auto py-2 px-3 whitespace-normal"
                  onClick={() => handleSampleQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`chat-message ${message.role === "user" ? "user-message" : "ai-message"}`}
              >
                {message.content}
                {message.role === "assistant" && (
                  <div className="flex gap-1 mt-2 justify-end">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message ai-message">
                <div className="flex gap-1">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse animation-delay-200">.</span>
                  <span className="animate-pulse animation-delay-400">.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          placeholder="Ask about your Salesforce metadata..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[80px] pr-12"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute bottom-2 right-2"
          disabled={!input.trim() || isLoading}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

// Mock function to generate demo responses
function generateDemoResponse(question: string): string {
  if (question.toLowerCase().includes("status__c")) {
    return "Deleting the 'Status__c' field on Account would impact:\n\n1. 3 Visualforce pages that reference this field\n2. 2 Apex classes with direct queries\n3. 1 Flow that updates this field\n\nThis field is actively used and deletion is not recommended without migration plan.";
  }
  
  if (question.toLowerCase().includes("unused")) {
    return "I found 5 unused custom fields on Opportunity:\n\n- Legacy_Amount__c (Created 2 years ago, no references)\n- Old_Stage__c (Deprecated, no references)\n- Temp_Notes__c (No references in code or layouts)\n- Test_Date__c (Only used in sandbox)\n- External_ID_Old__c (No references, potential cleanup candidate)";
  }
  
  if (question.toLowerCase().includes("lead") && question.toLowerCase().includes("contact")) {
    return "The data flow between Lead and Contact objects occurs during lead conversion process:\n\n1. Standard fields map automatically (Name, Email, Phone)\n2. Custom field 'Lead.Industry_Segment__c' maps to 'Contact.Industry_Segment__c'\n3. 2 Apex triggers execute during conversion (LeadConvertTrigger, ContactAfterCreateTrigger)\n4. Lead conversion process is customized by 'LeadConversionHandler' Apex class";
  }
  
  if (question.toLowerCase().includes("test") || question.toLowerCase().includes("coverage")) {
    return "OpportunityTrigger has 87% code coverage from these test classes:\n\n- OpportunityTriggerTest (primary, 75% coverage)\n- QuoteSyncTest (covers opportunity-quote sync logic, 12% coverage)\n\nUncovered areas include:\n- Exception handling block (lines 145-152)\n- Batch processing logic (lines 201-215)\n\nRecommend writing additional tests for these areas.";
  }
  
  return "Based on analysis of your metadata snapshot, I can provide the following insights:\n\n1. Your org has 148 custom objects with 1,203 custom fields\n2. Primary complexities are in the Opportunity management process\n3. Several Apex classes have low test coverage (below 75%)\n4. 12 unused fields were identified across various objects\n\nWould you like specific details about any of these areas?";
}
