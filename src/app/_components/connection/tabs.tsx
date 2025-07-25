import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { SignIn } from "./login";
import { Register } from "./register";
export const ConnectionTab: React.FC<{ defaultTab?: string }> = ({
  defaultTab = "login",
}) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="login" className="w-1/2">
          Connexion
        </TabsTrigger>
        <TabsTrigger value="register" className="w-1/2">
          Inscription
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="w-full">
        <SignIn />
      </TabsContent>
      <TabsContent value="register" className="w-full">
        <Register />
      </TabsContent>
    </Tabs>
  );
};
