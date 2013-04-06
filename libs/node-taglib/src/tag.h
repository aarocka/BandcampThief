#ifndef NODE_TAGLIB_TAG_H
#define NODE_TAGLIB_TAG_H

#include <fileref.h>
#include <node.h>
#include <sys/time.h>

namespace node_taglib {
class Tag : public node::ObjectWrap {
  TagLib::Tag * tag;
  TagLib::FileRef * fileRef;

  //static v8::Persistent<v8::FunctionTemplate> pft;

    public:
    static void Initialize(v8::Handle<v8::Object> target);
    Tag(TagLib::FileRef * fileRef);
    ~Tag();

    static v8::Handle<v8::Value> GetTitle(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetTitle(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> GetArtist(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetArtist(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> GetAlbum(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetAlbum(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> GetYear(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetYear(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> GetComment(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetComment(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> GetTrack(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetTrack(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> GetGenre(v8::Local<v8::String> property, const v8::AccessorInfo& info);
    static void SetGenre(v8::Local<v8::String> property, v8::Local<v8::Value> value, const v8::AccessorInfo& info);

    static v8::Handle<v8::Value> IsEmpty(const v8::Arguments &args);
    static v8::Handle<v8::Value> AsyncSaveTag(const v8::Arguments &args);
    static v8::Handle<v8::Value> SyncSaveTag(const v8::Arguments &args);
    static v8::Handle<v8::Value> SyncTag(const v8::Arguments &args);
    static v8::Handle<v8::Value> AsyncTag(const v8::Arguments &args);
    static void AsyncTagReadDo(uv_work_t *req);
    static void AsyncTagReadAfter(uv_work_t *req);
    static void AsyncSaveTagDo(uv_work_t *req);
    static void AsyncSaveTagAfter(uv_work_t *req);
};
}
#endif
