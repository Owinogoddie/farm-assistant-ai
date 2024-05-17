import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
export const prepareDocs = async () => {
  const loader = new PDFLoader(
    "/BYTES/AI/shamba-assistant-ai/public/recommendation-guidebook.pdf"
  );
  const docs = await loader.load();
  const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    // separators: ["\n\n", "\n", "."],
    chunkOverlap: 50,
  });
  const chunkedDocs = await text_splitter.splitDocuments(docs);
    // console.log("loader",docs);
  return chunkedDocs;
};
