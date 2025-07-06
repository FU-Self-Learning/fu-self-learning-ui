# PDF Course Generation Feature

## Tổng quan

Tính năng này cho phép instructor tự động tạo course, topics và lessons từ file PDF được upload lên. Hệ thống sẽ phân tích nội dung PDF và tự động generate cấu trúc course phù hợp.

## Cách sử dụng

### 1. Truy cập trang tạo course

- Đăng nhập với tài khoản instructor
- Vào trang `/instructor/course/create`

### 2. Chọn phương thức tạo course

- **Manual Creation**: Tạo course thủ công từng bước (tính năng cũ)
- **Generate from PDF**: Tự động generate từ file PDF (tính năng mới)

### 3. Upload PDF và generate

- Chọn file PDF cần upload
- Hệ thống sẽ phân tích và hiển thị cấu trúc course được generate
- Có thể regenerate nếu kết quả không phù hợp

### 4. Review và tạo course

- Xem lại cấu trúc course được generate
- Upload thumbnail và video intro
- Nhấn "Create Course with Generated Structure"

## Cấu trúc được generate

### Course Information

- **Title**: Tự động extract từ PDF
- **Description**: Tóm tắt nội dung PDF
- **Categories**: Tự động phân loại dựa trên nội dung

### Topics

- Được tạo dựa trên các chương/section trong PDF
- Mỗi topic có title và description

### Lessons

- Được tạo dựa trên các subsection trong PDF
- Mỗi lesson có title và description
- Video sẽ được tạo placeholder (instructor upload sau)

## API Endpoints

### Generate Course from PDF

```
POST /api/courses/generate-from-pdf
Content-Type: multipart/form-data

Body:
- pdf: File (PDF document)
```

Response:

```json
{
  "course": {
    "title": "Generated Course Title",
    "description": "Course description",
    "categoryIds": [1, 2]
  },
  "topics": [
    {
      "title": "Topic Title",
      "description": "Topic description",
      "lessons": [
        {
          "title": "Lesson Title",
          "description": "Lesson description"
        }
      ]
    }
  ]
}
```

## Components

### PDFCourseGenerator

- Component chính để upload PDF và hiển thị kết quả generate
- Xử lý upload file và gọi API generate
- Hiển thị progress bar trong quá trình xử lý

### Hooks

#### useGenerateCourseFromPDF

- Hook để gọi API generate course từ PDF
- Xử lý loading state và error handling

#### useCreateCourseWithStructure

- Hook để tạo course cùng với topics và lessons
- Tự động tạo topics và lessons sau khi tạo course

## Workflow

1. **Upload PDF** → API phân tích nội dung
2. **Generate Structure** → Tạo cấu trúc course, topics, lessons
3. **Review** → Instructor xem lại và chỉnh sửa nếu cần
4. **Create Course** → Tạo course với cấu trúc đã generate
5. **Redirect** → Chuyển đến trang course detail

## Lưu ý

- Chỉ hỗ trợ file PDF
- Video lessons sẽ được tạo placeholder, instructor cần upload video thực tế sau
- Có thể regenerate nếu kết quả không phù hợp
- Cấu trúc được generate có thể được chỉnh sửa thủ công sau khi tạo

## Backend Requirements

Backend cần implement endpoint `/api/courses/generate-from-pdf` để:

- Nhận file PDF
- Phân tích nội dung (có thể sử dụng AI/ML)
- Trả về cấu trúc course được generate
- Xử lý các loại PDF khác nhau (text, scanned, etc.)

## Future Enhancements

- Hỗ trợ nhiều định dạng file (Word, PowerPoint)
- Tích hợp AI để cải thiện chất lượng generate
- Preview nội dung PDF trước khi generate
- Tùy chỉnh cấu trúc generate (số lượng topics, lessons)
- Export/import cấu trúc course
