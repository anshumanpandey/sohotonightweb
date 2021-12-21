import { SSM, config } from "aws-sdk";

export const AwsConfig = {
  region: "us-east-2",
  accessKeyId: "AKIAZ356KF2DPFUZGI4A",
  secretAccessKey: "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",
};

config.update(AwsConfig);
const AwsSsm = new SSM();

export const getAwsCredentials = async () => {
  const result = await Promise.all([
    AwsSsm.getParameter({
      Name: "kinesis_key",
      WithDecryption: true,
    }).promise(),
    AwsSsm.getParameter({
      Name: "kinesis_secret",
      WithDecryption: true,
    }).promise(),
  ]);
  const key = result[0]?.Parameter?.Value;
  const secret = result[1]?.Parameter?.Value;
  if (!key || !secret) throw new Error("Could not get AWS credentials");
  return {
    key,
    secret,
  };
};
