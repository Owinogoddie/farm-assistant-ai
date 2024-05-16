"use client";
import React, { useState,useEffect } from "react";
import { Heading } from "../_components/heading";
import { MessageSquare } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../_components/user-avatar";
import { BotAvatar } from "../_components/bot-avatar";
import { Empty } from "../_components/empty";
import { conversationPrompt } from "@/utils/conversation-prompt";
import { Loader } from "../_components/loader";

const formSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
});
const ConversationPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([])
  function saveToLocalStorage(history) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('conversationHistory', JSON.stringify(history));
    }
  }
  function getFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('conversationHistory');
      return history ? JSON.parse(history) : [];
    }
    return [];
  }
  function appendToLocalStorage(newItem) {
    const history = getFromLocalStorage();
    history.push(newItem);
    saveToLocalStorage(history);
    // Update the messages state with the new history
    setMessages(history.map((message, index) => ({
      role: index % 2 === 0 ? 'user' : 'ai',
      content: message
    })));
  }
 
 
 
  function clearHistory() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('conversationHistory');
    }
    setMessages([]);
  }
  useEffect(() => {
    setMessages(getFromLocalStorage().map((message, index) => ({
      role: index % 2 === 0 ? 'user' : 'ai',
      content: message
    })));
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isloading = form.formState.isLoading;

  const updateMessagesFromLocalStorage = () => {
    const savedHistory = localStorage.getItem('conversationHistory');
    const messagesArray = savedHistory ? JSON.parse(savedHistory) : [];
    const formattedMessages = messagesArray.map((message, index) => ({
      role: index % 2 === 0 ? 'user' : 'ai',
      content: message
    }));
    setMessages(formattedMessages);
  };

  // Effect to listen for local storage changes
  
  async function onSubmit(values) {
    setLoading(true)
    const {prompt:user_input}=values
    try {
      const model = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_API_GROQ_API_KEY,
        streaming: true,
      });
     
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", conversationPrompt],
        ["human", "{input}"],
      ]);
      const chain = prompt.pipe(model);
      const updatedConvHistory = getFromLocalStorage();
      const response = await chain.invoke({
        input: user_input,
        convHistory:updatedConvHistory
      });
      const res=response.lc_kwargs.content
      appendToLocalStorage(user_input);

      // Append response to the conversation history in local storage
      appendToLocalStorage(res);
      updateMessagesFromLocalStorage()
      
      console.log("response", res);
      console.log("history", getFromLocalStorage());
      console.log("messages", messages);

    } catch (error) {
      console.log(error.message)
      
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <Heading
        bgColor="bg-emerald-500/10"
        iconColor="text-emerald-500"
        description="Chat wit the an expert to get what your farm needs"
        icon={MessageSquare}
        title="Chat with a farm expert"
      />
      <div>
      <div>
        <Button onClick={clearHistory} siz="sm" variant="secondary" className="m-3">
        clear history
        </Button>
      </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="roumded-lg border w-full p-4 px-3 md:px-6 focus-within:sm grid grid-cols-12 gap-2"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormLabel>Prompt</FormLabel>
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent border-b-2"
                      placeholder="Start chatting"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="col-span-12 lg:col-span-2 w-full"
              disabled={loading}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {loading && (
          <div>
            {<Loader/>}
          </div>
        )}
        {messages.length === 0 && !isloading &&!loading && (
          <div>
            <Empty />
          </div>
        )}
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message) => (
            <div
              key={message.content}
              className={cn(
                "w-full p-8 flex items-start gap-x-8 rounded-lg",
                message.role === "user"
                  ? "bg-white border border-black/10"
                  : "bg-muted"
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ConversationPage;
