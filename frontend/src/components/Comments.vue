<template>
    <div>
        <div :style="{'padding-left': `${depth * 10}px`, 'background-color': 'lightgrey', 'border-radius': '40px'}">
            <h4 style="color: red;">{{ node.Username }}</h4>
            <p style="color: black;">{{ node.Comment }}</p>
            <div style="width: 30%; display: flex; justify-content: space-between">
                <span><i :id="node.CommentID" class="far fa-thumbs-up"></i></span>
                <span><i :id="node.CommentID" class="far fa-thumbs-down"></i></span>
                <span :id="node.CommentID" @click="reply($event)" style="opacity: 0.6; cursor: pointer;">Reply</span>
            </div>
        </div>
        <div>
            <Comments
                v-for="child in node.children"
                :key="child.Comment"
                :node="child"
                :depth="depth + 1"
            />
        </div>
    </div> 
</template>

<script>
export default {
    name: 'Comments',
    props: {
        node: Object,
        depth: {
            type: Number,
            default: 5,
        }
    }
}
</script>

<style>

</style>