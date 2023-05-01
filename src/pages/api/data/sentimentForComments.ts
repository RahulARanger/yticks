import { AskForSentimentForVideoComments } from "@/components/types/askForNLP";
import { ExpectedDetails } from "@/components/types/response";

export type ExpectedSentimentDetails = ExpectedDetails<AskForSentimentForVideoComments | false>;
