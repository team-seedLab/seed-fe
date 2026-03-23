import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import {
  Box,
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import {
  type AssignmentType,
  ROADMAP_STEP_CODES,
  ROADMAP_TYPE_MAP,
  useCreateProject,
  useUploadFlowStore,
} from "@/entities";
import { formatSize } from "@/features";
import {
  AcademicCapIcon,
  BeakerIcon,
  BoardTeacherIcon,
  DocumentTextIcon,
  FilePdfIcon,
  FilePenIcon,
  PictureIcon,
  PlusCircleIcon,
  ROUTE_PATHS,
  StudyIcon,
  XMarkIcon,
} from "@/shared";

type UploadedFile = {
  id: string;
  file: File;
};

const MAX_FILES = 3;
const MAX_CONTENT_LENGTH = 1000;

const ASSIGNMENT_TYPES: {
  label: AssignmentType;
  Icon: React.ComponentType<{ color?: string; boxSize?: string | number }>;
}[] = [
  { label: "글쓰기형", Icon: FilePenIcon },
  { label: "논문형", Icon: AcademicCapIcon },
  { label: "발표형", Icon: BoardTeacherIcon },
  { label: "실습형", Icon: BeakerIcon },
  { label: "요약형", Icon: DocumentTextIcon },
  { label: "학습형", Icon: StudyIcon },
];

const isPdf = (file: File) => file.type === "application/pdf";
const isImage = (file: File) => file.type.startsWith("image/");

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState<AssignmentType>("글쓰기형");
  const [content, setContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createProject, isPending } = useCreateProject();
  const reset = useUploadFlowStore((state) => state.reset);

  const canSubmit =
    title.trim().length > 0 &&
    (uploadedFiles.length > 0 || content.trim().length > 0);

  const stepCount = ROADMAP_STEP_CODES[ROADMAP_TYPE_MAP[selectedType]].length;

  const addFiles = (newFiles: File[]) => {
    setUploadedFiles((prev) => {
      const remaining = MAX_FILES - prev.length;
      const toAdd = newFiles.slice(0, remaining);
      return [
        ...prev,
        ...toAdd.map((file) => ({ id: crypto.randomUUID(), file })),
      ];
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const startAnalysis = () => {
    if (!canSubmit || isPending) return;

    reset();
    createProject({
      title,
      roadmapType: ROADMAP_TYPE_MAP[selectedType],
      userIntent: content,
      files: uploadedFiles.map((f) => f.file),
    });
    navigate(ROUTE_PATHS.UPLOAD_LOADING);
  };

  const FileIcon = ({ file }: { file: File }) => {
    if (isPdf(file))
      return (
        <Flex
          align="center"
          bg="pdf.bg"
          borderRadius="lg"
          flexShrink={0}
          boxSize={9}
          justify="center"
        >
          <FilePdfIcon color="pdf" boxSize={4} />
        </Flex>
      );
    if (isImage(file))
      return (
        <Flex
          align="center"
          bg="green.50"
          borderRadius="lg"
          flexShrink={0}
          boxSize={9}
          justify="center"
        >
          <PictureIcon color="green.500" boxSize={4} />
        </Flex>
      );
    return (
      <Flex
        align="center"
        bg="neutral.100"
        borderRadius="lg"
        flexShrink={0}
        boxSize={9}
        justify="center"
      >
        <FilePenIcon color="neutral.500" boxSize={4} />
      </Flex>
    );
  };

  return (
    <Flex align="center" bg="white" direction="column" minH="100vh">
      <Flex
        direction="column"
        align="center"
        gap={12}
        maxW="1024px"
        py={20}
        px={6}
        w="full"
      >
        <Box maxW="768px" w="full">
          <Input
            color={title ? "neutral.900" : "neutral.300"}
            fontSize="4xl"
            fontWeight="bold"
            placeholder="새 프로젝트 제목을 입력하세요"
            textAlign="center"
            value={title}
            border="none"
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Flex
          bg="white"
          borderRadius="4xl"
          boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
          direction="column"
          gap={12}
          p={12}
          w="full"
        >
          <VStack align="flex-start" gap={4} w="full">
            <Text color="neutral.600" fontSize="sm" fontWeight="semibold">
              과제 유형
            </Text>
            <HStack gap={3} flexWrap="wrap">
              {ASSIGNMENT_TYPES.map(({ label, Icon }) => {
                const isActive = selectedType === label;
                return (
                  <Flex
                    key={label}
                    align="center"
                    bg={isActive ? "seed.subtle" : "neutral.50"}
                    border="2px solid"
                    borderColor={isActive ? "seed" : "neutral.50"}
                    borderRadius="3xl"
                    cursor="pointer"
                    gap={2}
                    h={14}
                    justify="center"
                    minW="120px"
                    px={5}
                    transition="all 0.15s"
                    onClick={() => setSelectedType(label)}
                  >
                    <Icon
                      color={isActive ? "seed" : "neutral.900"}
                      boxSize="15px"
                    />
                    <Text
                      color={isActive ? "seed.900" : "neutral.900"}
                      fontSize="sm"
                      fontWeight="semibold"
                      whiteSpace="nowrap"
                    >
                      {label}
                    </Text>
                  </Flex>
                );
              })}
            </HStack>
          </VStack>

          <VStack align="flex-start" gap={4} w="full">
            <Text
              color="neutral.600"
              fontSize="sm"
              fontWeight="semibold"
              textTransform="uppercase"
            >
              내용 작성 및 자료 업로드
            </Text>

            <Flex
              border="1px solid"
              borderColor="neutral.50"
              borderRadius="4xl"
              boxShadow="0px 4px 20px 0px rgba(0,0,0,0.02)"
              overflow="hidden"
              w="full"
            >
              <Flex bg="white" direction="column" flex={1} p={8}>
                <Textarea
                  color="neutral.900"
                  flex={1}
                  h={64}
                  placeholder={`교수님이 제시한 과제 주제나 요구사항을 자유롭게 적어주세요.\n예) '마케팅 전략 분석 리포트 작성, 2000자 내외, SWOT 분석 포함 필수'`}
                  resize="none"
                  value={content}
                  border="none"
                  _focusVisible={{ outline: "none", boxShadow: "none" }}
                  _placeholder={{ color: "neutral.300" }}
                  maxLength={MAX_CONTENT_LENGTH}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Flex
                  align="center"
                  borderTop="1px solid"
                  borderColor="neutral.50"
                  justify="space-between"
                  pt={4}
                >
                  <Box bg="neutral.50" borderRadius="md" px={2} py={1}>
                    <Text color="neutral.600" fontSize="xs" fontWeight="medium">
                      텍스트 입력
                    </Text>
                  </Box>
                  <Text color="neutral.600" fontSize="12px" fontWeight="medium">
                    {content.length} / {MAX_CONTENT_LENGTH.toLocaleString()}자
                  </Text>
                </Flex>
              </Flex>

              <Flex
                bg="neutral.50"
                borderLeft="1px solid"
                borderColor="neutral.50"
                direction="column"
                flexShrink={0}
                justify="center"
                minH="377px"
                p={8}
                w={80}
              >
                {uploadedFiles.length === 0 ? (
                  <>
                    <input
                      ref={fileInputRef}
                      accept=".pdf,image/*"
                      multiple
                      style={{ display: "none" }}
                      type="file"
                      onChange={handleFileInput}
                    />
                    <Flex
                      align="center"
                      border="2px dashed"
                      borderColor={isDragging ? "seed" : "neutral.300"}
                      borderRadius="2xl"
                      cursor="pointer"
                      direction="column"
                      flex={1}
                      gap={3}
                      justify="center"
                      minH="200px"
                      p={6}
                      transition="border-color 0.15s"
                      onClick={() => fileInputRef.current?.click()}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Flex
                        align="center"
                        bg="white"
                        borderRadius="full"
                        boxSize={12}
                        justify="center"
                      >
                        <Text fontSize="2xl" color="neutral.600">
                          +
                        </Text>
                      </Flex>
                      <VStack gap={1}>
                        <Text
                          color="neutral.900"
                          fontSize="sm"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          파일을 드래그하세요
                        </Text>
                        <Text
                          color="neutral.600"
                          fontSize="xs"
                          textAlign="center"
                        >
                          또는 클릭하여 업로드
                        </Text>
                      </VStack>
                      <Flex
                        align="center"
                        bg="white"
                        borderRadius="full"
                        gap={1}
                        px={3}
                        py={1}
                      >
                        <FilePdfIcon color="neutral.600" boxSize="10px" />
                        <Text color="neutral.600" fontSize="10px">
                          PDF (최대 3개)
                        </Text>
                      </Flex>
                    </Flex>
                  </>
                ) : (
                  <VStack
                    align="stretch"
                    gap={3}
                    flex={1}
                    justify="space-between"
                  >
                    <VStack align="stretch" gap={2}>
                      {uploadedFiles.map(({ id, file }) => (
                        <Flex
                          key={id}
                          align="center"
                          bg="white"
                          borderRadius="xl"
                          boxShadow="0px 2px 8px 0px rgba(0,0,0,0.06)"
                          gap={3}
                          p={3}
                        >
                          <FileIcon file={file} />
                          <VStack align="flex-start" flex={1} gap={0} minW={0}>
                            <Text
                              color="neutral.900"
                              fontSize="xs"
                              fontWeight="semibold"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              w="full"
                            >
                              {file.name}
                            </Text>
                            <Text color="neutral.600" fontSize="2xs">
                              {formatSize(file.size)}
                            </Text>
                          </VStack>
                          <Flex
                            align="center"
                            cursor="pointer"
                            flexShrink={0}
                            h={6}
                            justify="center"
                            w={6}
                            onClick={() => removeFile(id)}
                          >
                            <XMarkIcon color="neutral.600" boxSize={3} />
                          </Flex>
                        </Flex>
                      ))}

                      {uploadedFiles.length < MAX_FILES && (
                        <>
                          <input
                            ref={addFileInputRef}
                            accept=".pdf,image/*"
                            multiple
                            style={{ display: "none" }}
                            type="file"
                            onChange={handleFileInput}
                          />
                          <Flex
                            align="center"
                            color="neutral.600"
                            cursor="pointer"
                            gap={2}
                            justify="center"
                            py={2}
                            _hover={{ color: "seed" }}
                            transition="color 0.15s"
                            onClick={() => addFileInputRef.current?.click()}
                          >
                            <PlusCircleIcon boxSize={4} />
                            <Text fontSize="xs" fontWeight="medium">
                              파일 추가하기
                            </Text>
                          </Flex>
                        </>
                      )}
                    </VStack>

                    <VStack align="stretch" gap={1}>
                      <Box
                        bg="neutral.300"
                        borderRadius="full"
                        h={1.5}
                        overflow="hidden"
                      >
                        <Box
                          bg="seed"
                          borderRadius="full"
                          h="full"
                          transition="width 0.3s"
                          w={`${(uploadedFiles.length / MAX_FILES) * 100}%`}
                        />
                      </Box>
                      <Text
                        color="neutral.600"
                        fontSize="xs"
                        fontWeight="medium"
                        textAlign="right"
                      >
                        {uploadedFiles.length} / {MAX_FILES}개 업로드됨
                      </Text>
                    </VStack>
                  </VStack>
                )}
              </Flex>
            </Flex>
          </VStack>

          <Flex direction="column" align="center" gap={6}>
            <Flex
              align="center"
              bg="seed"
              borderRadius="2xl"
              boxShadow="0px 8px 20px 0px rgba(152,201,92,0.25)"
              cursor={canSubmit && !isPending ? "pointer" : "not-allowed"}
              gap={2}
              h={14}
              justify="center"
              maxW={96}
              onClick={startAnalysis}
              opacity={canSubmit && !isPending ? 1 : 0.5}
              px={8}
              transition="opacity 0.15s"
              w="full"
              _hover={{
                opacity: canSubmit && !isPending ? 0.85 : 0.5,
              }}
            >
              <Text color="white" fontWeight="bold">
                {stepCount}단계 로드맵 생성하기 →
              </Text>
            </Flex>
            <Text color="neutral.600" fontSize="xs" textAlign="center">
              작성하신 내용은 로드맵 생성 후 수정하실 수 있습니다.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
